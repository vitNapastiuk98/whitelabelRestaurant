const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters';
process.env.ADMIN_PASSWORD = ' a-test-password '; // Password whitespace is significant.

let database, app, token, tenantId;
before(async () => {
  database = await MongoMemoryServer.create();
  process.env.MONGODB_URI = database.getUri();
  const { connectDB } = require('../dist/lib/db');
  const { seed } = require('../dist/lib/seed');
  await connectDB();
  await seed();
  app = await require('../dist/app').createApp();
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});
after(async () => {
  if (app) await app.close();
  await mongoose.disconnect();
  if (database) await database.stop();
});

async function request(path, method = 'GET', body, authenticated = false, host = 'localhost') {
  const response = await app.inject({
    method, url: `/api${path}`,
    headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), Host: host,
      ...(authenticated ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { payload: body }),
  });
  return { status: response.statusCode, body: response.json() };
}

test('public config resolves the host and never exposes integration keys', async () => {
  const result = await request('/whitelabel');
  assert.equal(result.status, 200);
  tenantId = result.body.whitelabelId;
  assert.ok(tenantId);
  assert.equal(result.body.theForkKey, undefined);
  assert.ok(result.body.content.menu.categories.length);
  assert.equal((await request('/whitelabel', 'GET', undefined, false, 'unknown.example')).status, 404);
});

test('admin login rejects invalid credentials and permits authenticated changes', async () => {
  assert.equal((await request('/auth/login', 'POST', { username: 'admin', password: 'wrong' })).status, 401);
  const login = await request('/auth/login', 'POST', { username: 'admin', password: process.env.ADMIN_PASSWORD });
  assert.equal(login.status, 200);
  token = login.body.token;
  assert.ok(token);
  assert.equal((await request('/reservations')).status, 401);
  assert.equal((await request('/whitelabel', 'PUT', { name: 'Updated' })).status, 401);
  assert.equal((await request('/whitelabel', 'PUT', { name: 'Updated' }, true)).status, 200);
  assert.equal((await request('/whitelabel')).body.name, 'Updated');
});

test('content saves persist and reject malformed menu prices', async () => {
  const menu = { title: 'Dinner', description: 'Fresh', categories: [
    { name: 'Primi', items: [{ name: 'Pasta', price: 12 }] },
  ] };
  assert.equal((await request('/content/menu', 'PUT', menu, true)).status, 200);
  assert.deepEqual((await request('/whitelabel')).body.content.menu, menu);
  menu.categories[0].items[0].price = -1;
  assert.equal((await request('/content/menu', 'PUT', menu, true)).status, 400);
  assert.equal((await request('/content/unknown', 'PUT', {}, true)).status, 400);
});

test('reservations persist contact details, validate input and ignore supplied tenant IDs', async () => {
  const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const booking = { name: 'Guest', email: 'guest@example.com', phone: '+39123456789',
    date, time: '19:00', guests: 2, consent: true, whitelabelId: new mongoose.Types.ObjectId().toString() };
  const saved = await request('/reservations', 'POST', booking);
  assert.equal(saved.status, 200);
  assert.equal(saved.body.whitelabelId, tenantId);
  const list = await request('/reservations', 'GET', undefined, true);
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].phone, booking.phone);
  for (const invalid of [{ guests: 0 }, { guests: 1.5 }, { consent: false }, { date: '2020-01-01' },
    { date: '2030-02-31' }, { time: '25:00' }, { name: '' }, { email: 'invalid' }]) {
    assert.equal((await request('/reservations', 'POST', { ...booking, ...invalid })).status, 400);
  }
  assert.equal((await request(`/reservations/${saved.body._id}`, 'DELETE', undefined, true)).status, 200);
  assert.equal((await request('/reservations', 'GET', undefined, true)).body.length, 0);
});

test('messages persist and are only visible to the tenant admin', async () => {
  const message = { name: 'Guest', email: 'guest@example.com', phone: '1234567', message: 'Hello', consent: true };
  assert.equal((await request('/messages', 'POST', message)).status, 200);
  assert.equal((await request('/messages')).status, 401);
  assert.equal((await request('/messages', 'GET', undefined, true)).body[0].message, 'Hello');
  assert.equal((await request('/messages', 'POST', { ...message, consent: false })).status, 400);
});

test('tenant boundaries protect config, bookings, messages and content', async () => {
  const { WhitelabelConfigModel } = require('../dist/lib/db');
  const other = await WhitelabelConfigModel.create({ domain: 'other.example', name: 'Other', theme: 'default-theme',
    enabledFeatures: { menu: true, events: true, reservations: true, theFork: false } });
  assert.equal((await request('/whitelabel', 'PUT', { name: 'Hacked' }, true, 'other.example')).status, 403);
  assert.equal((await request('/reservations', 'GET', undefined, true, 'other.example')).status, 403);
  assert.equal((await request('/messages', 'GET', undefined, true, 'other.example')).status, 403);
  assert.equal((await request('/content/menu', 'PUT', { title: 'Hacked', categories: [] }, true, 'other.example')).status, 403);
  assert.equal((await request('/whitelabel', 'GET', undefined, false, 'other.example')).body.name, other.name);
});

test('seed preserves existing content, users and legacy menu data', async () => {
  const { WhitelabelConfigModel, UserModel, MenuCategoryModel, MenuItemModel, EventModel, FileDocumentModel } = require('../dist/lib/db');
  const { seed } = require('../dist/lib/seed');
  const tenant = await WhitelabelConfigModel.findById(tenantId);
  const user = await UserModel.findOne({ whitelabelId: tenantId }).select('+password');
  const category = await MenuCategoryModel.create({ name: 'Original category', whitelabelId: tenantId });
  const file = await FileDocumentModel.create({ name: 'Photo', path: '/original-photo.png', type: 'image/png', whitelabelId: tenantId });
  await MenuItemModel.create({ name: 'Original dish', price: 19, photo: String(file._id), category: category._id, whitelabelId: tenantId });
  await EventModel.create({ title: 'Original event', date: '2026-12-01T20:30:00Z', image: String(file._id), whitelabelId: tenantId });
  await WhitelabelConfigModel.updateOne({ _id: tenantId }, { $unset: { 'content.menu': 1, 'content.events': 1 } });
  await seed(); await seed();
  const updated = await WhitelabelConfigModel.findById(tenantId);
  assert.equal(updated.name, tenant.name);
  assert.deepEqual(updated.content.about, tenant.content.about);
  assert.equal(updated.content.menu.categories[0].items[0].name, 'Original dish');
  assert.equal(updated.content.menu.categories[0].items[0].photo, file.path);
  assert.equal(updated.content.events.events[0].photo, file.path);
  assert.equal(updated.content.events.events[0].date, '2026-12-01T20:30:00.000Z');
  assert.equal(await UserModel.countDocuments({ whitelabelId: tenantId }), 1);
  assert.equal((await UserModel.findById(user._id).select('+password')).password, user.password);
  assert.equal(await MenuItemModel.countDocuments({ whitelabelId: tenantId }), 1);
});

test('rejects forged sessions, unsafe images and unknown content shapes', async () => {
  const savedToken = token;
  token = 'forged';
  assert.equal((await request('/reservations', 'GET', undefined, true)).status, 401);
  token = savedToken;
  assert.equal((await request('/content/home', 'PUT', { items: [{ text1: 'Title', file: 'javascript:alert(1)' }] }, true)).status, 400);
  assert.equal((await request('/content/menu', 'PUT', { title: 'Menu', categories: null }, true)).status, 400);
});

test('palettes persist and reject partial or unsafe colors', async () => {
  const colors = { primary: '#123456', background: '#ffffff', text: '#101010', button: '#abcdef' };
  assert.equal((await request('/whitelabel', 'PUT', { name: 'Updated', colors }, true)).status, 200);
  assert.deepEqual((await request('/whitelabel')).body.colors, colors);
  for (const invalid of [{ primary: '#ffffff' }, { ...colors, text: 'red' }, null]) {
    assert.equal((await request('/whitelabel', 'PUT', { name: 'Updated', colors: invalid }, true)).status, 400);
  }
  assert.deepEqual((await request('/whitelabel')).body.colors, colors);
});

test('admin creation hashes passwords and returns tenant-scoped safe fields', async () => {
  assert.equal((await request('/admins')).status, 401);
  assert.equal((await request('/admins', 'POST', { username: 'staff', password: 'staff-password-123' })).status, 401);
  for (const username of ['ab', 'bad name', 'éclair', 'a'.repeat(81)]) {
    assert.equal((await request('/admins', 'POST', { username, password: 'staff-password-123' }, true)).status, 400);
  }
  for (const password of ['short', 'é'.repeat(37)]) {
    assert.equal((await request('/admins', 'POST', { username: 'staff', password }, true)).status, 400);
  }
  const created = await request('/admins', 'POST', { username: 'staff', password: 'staff-password-123', whitelabelId: 'ignored' }, true);
  assert.equal(created.status, 200);
  assert.deepEqual(Object.keys(created.body).sort(), ['_id', 'createdAt', 'username']);
  const { UserModel } = require('../dist/lib/db');
  const stored = await UserModel.findById(created.body._id).select('+password');
  assert.notEqual(stored.password, 'staff-password-123');
  assert.equal(String(stored.whitelabelId), tenantId);
  const staffLogin = await request('/auth/login', 'POST', { username: 'staff', password: 'staff-password-123' });
  assert.equal(staffLogin.status, 200);
  assert.equal((await app.inject({ method: 'GET', url: '/api/admins', headers: { host: 'localhost', authorization: `Bearer ${staffLogin.body.token}` } })).statusCode, 200);
  assert.equal((await request('/auth/login', 'POST', { username: 'staff', password: 'staff-password-123' }, false, 'other.example')).status, 401);
  assert.equal((await request('/admins', 'POST', { username: 'staff', password: 'another-password' }, true)).status, 409);
  const { WhitelabelConfigModel } = require('../dist/lib/db');
  const other = await WhitelabelConfigModel.findOne({ domain: 'other.example' });
  await UserModel.create({ username: 'other-hidden', password: 'unused-hash', whitelabelId: other._id });
  const admins = await request('/admins', 'GET', undefined, true);
  assert.equal(admins.body.length, 2);
  assert.ok(admins.body.every(admin => !('password' in admin) && !('whitelabelId' in admin)));
  for (const method of ['GET', 'POST']) {
    assert.equal((await request('/admins', method, method === 'POST' ? { username: 'attacker', password: 'another-password' } : undefined, true, 'other.example')).status, 403);
  }
});

test('domains preserve the current hostname, route aliases and reject invalid names and conflicts', async () => {
  const change = { domain: ' Restaurant.Example ', aliases: ['Dining.Example', 'dining.example'] };
  assert.equal((await request('/whitelabel/domain', 'PUT', change)).status, 401);
  const updated = await request('/whitelabel/domain', 'PUT', change, true);
  assert.equal(updated.status, 200);
  assert.equal(updated.body.domain, 'restaurant.example');
  assert.deepEqual(updated.body.domains.sort(), ['dining.example', 'localhost', 'restaurant.example']);
  assert.equal((await request('/whitelabel', 'GET', undefined, false, 'dining.example:3000')).body.whitelabelId, tenantId);
  assert.equal((await request('/whitelabel/domain', 'PUT', { domain: 'new.example', aliases: [] }, true, 'dining.example')).status, 200);
  assert.equal((await request('/whitelabel', 'GET', undefined, false, 'dining.example')).body.whitelabelId, tenantId);
  assert.equal((await request('/whitelabel/domain', 'PUT', { domain: 'localhost', aliases: ['dining.example'] }, true, 'dining.example')).status, 200);
  for (const domain of ['https://bad.example', 'bad.example/path', '*.example', 'bad.example:3000', '-bad.example', 'bad..example']) {
    assert.equal((await request('/whitelabel/domain', 'PUT', { domain, aliases: [] }, true)).status, 400);
  }
  for (const change of [{ domain: 'other.example', aliases: [] }, { domain: 'localhost', aliases: ['other.example'] }]) {
    assert.equal((await request('/whitelabel/domain', 'PUT', change, true)).status, 409);
  }
  assert.equal((await request('/whitelabel/domain', 'PUT', { domain: 'other.example', aliases: [] }, true, 'other.example')).status, 403);
  assert.equal((await request('/admins', 'GET', undefined, true, 'dining.example')).status, 200);
});

test('unique hostname membership rejects concurrent primary and alias claims', async () => {
  const { WhitelabelConfigModel, UserModel } = require('../dist/lib/db');
  const other = await WhitelabelConfigModel.findOne({ domain: 'other.example' });
  const otherUser = await UserModel.create({ username: 'other-admin', password: 'unused-hash', whitelabelId: other._id });
  const otherToken = require('jsonwebtoken').sign({ userId: String(otherUser._id) }, process.env.JWT_SECRET);
  const attempt = (host, bearer, domain, aliases) => app.inject({ method: 'PUT', url: '/api/whitelabel/domain',
    headers: { host, authorization: `Bearer ${bearer}` }, payload: { domain, aliases } });
  const results = await Promise.all([
    attempt('localhost', token, 'localhost', ['claimed.example']),
    attempt('other.example', otherToken, 'claimed.example', []),
  ]);
  assert.deepEqual(results.map(result => result.statusCode).sort(), [200, 409]);
  assert.equal(await WhitelabelConfigModel.countDocuments({ domains: 'claimed.example' }), 1);
});

test('legacy domain migration preserves data, reserves all primary hosts and makes renamed seeds idempotent', async () => {
  const { WhitelabelConfigModel, UserModel, migrateDomains } = require('../dist/lib/db');
  const original = await WhitelabelConfigModel.findById(tenantId);
  const user = await UserModel.findOne({ username: 'admin' }).select('+password');
  const legacy = await WhitelabelConfigModel.collection.insertOne({ domain: 'legacy.example', name: 'Legacy', content: { custom: 'preserved' } });
  await WhitelabelConfigModel.collection.updateOne({ _id: original._id }, { $unset: { domains: '' } });
  await migrateDomains(); await migrateDomains();
  const migrated = await WhitelabelConfigModel.findById(tenantId);
  assert.deepEqual(migrated.domains, [migrated.domain]);
  assert.deepEqual(migrated.content, original.content);
  assert.equal((await UserModel.findById(user._id).select('+password')).password, user.password);
  assert.equal((await request('/whitelabel', 'GET', undefined, false, 'legacy.example')).body.name, 'Legacy');
  assert.equal((await request('/whitelabel/domain', 'PUT', { domain: 'localhost', aliases: ['legacy.example'] }, true)).status, 409);
  assert.equal((await WhitelabelConfigModel.findById(legacy.insertedId)).content.custom, 'preserved');
  assert.equal((await request('/whitelabel/domain', 'PUT', { domain: 'renamed.example', aliases: [] }, true)).status, 200);
  await require('../dist/lib/seed').seed();
  assert.equal(await WhitelabelConfigModel.countDocuments({ domains: 'localhost' }), 1);
  assert.equal(await UserModel.countDocuments({ username: 'admin' }), 1);
});

test('an identity save cannot overwrite a concurrent domain change', async () => {
  const { WhitelabelConfigModel } = require('../dist/lib/db');
  const original = await WhitelabelConfigModel.create({ domain: 'before.example', name: 'Before' });
  const stale = await WhitelabelConfigModel.findById(original._id);
  await WhitelabelConfigModel.updateOne({ _id: original._id }, { $set: { domain: 'after.example', domains: ['after.example', 'before.example'] } });
  stale.name = 'After';
  await stale.save();
  const updated = await WhitelabelConfigModel.findById(original._id);
  assert.equal(updated.domain, 'after.example');
  assert.deepEqual(updated.domains, ['after.example', 'before.example']);
  assert.equal(updated.name, 'After');
});

test('seed finds the configured admin tenant after its original hostname is removed', async () => {
  const { WhitelabelConfigModel, UserModel } = require('../dist/lib/db');
  // The prior migration test renamed localhost to renamed.example, preserving localhost.
  assert.equal((await request('/whitelabel/domain', 'PUT', { domain: 'final.example', aliases: [] }, true, 'renamed.example')).status, 200);
  assert.equal((await request('/whitelabel')).status, 404);
  const before = await WhitelabelConfigModel.findById(tenantId).lean();
  const users = await UserModel.find({ whitelabelId: tenantId }).select('+password').lean();
  const count = await WhitelabelConfigModel.countDocuments();
  await require('../dist/lib/seed').seed();
  await require('../dist/lib/seed').seed();
  assert.equal(await WhitelabelConfigModel.countDocuments(), count);
  assert.deepEqual(await WhitelabelConfigModel.findById(tenantId).lean(), before);
  assert.deepEqual(await UserModel.find({ whitelabelId: tenantId }).select('+password').lean(), users);
  assert.equal((await request('/auth/login', 'POST', { username: 'admin', password: process.env.ADMIN_PASSWORD }, false, 'final.example')).status, 200);
});

test('native modules expose host-independent readiness and reject unknown API routes', async () => {
  const health = await request('/health', 'GET', undefined, false, 'unconfigured.example');
  assert.equal(health.status, 200);
  assert.deepEqual(health.body, { status: 'ok' });
  const response = await app.inject({ method: 'GET', url: '/api/health', headers: { Host: 'unconfigured.example' } });
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal((await request('/missing')).status, 404);
  assert.equal((await request('/auth/login/extra', 'POST', {})).status, 404);
  const { WhitelabelConfigModel } = require('../dist/lib/db');
  const host = (await WhitelabelConfigModel.findById(tenantId)).domain;
  assert.equal((await request('/admins', 'GET', undefined, false, host)).status, 401);
  assert.equal((await request('/whitelabel', 'PUT', [], true, host)).status, 400);
  assert.equal((await request('/messages', 'POST', 'invalid', false, host)).status, 400);
});

test('hosted seed uses Render hostname without resetting existing tenants', async () => {
  const { seed } = require('../dist/lib/seed');
  const { WhitelabelConfigModel, UserModel } = require('../dist/lib/db');
  const previous = Object.fromEntries(['RESTAURANT_DOMAIN', 'RENDER_EXTERNAL_HOSTNAME', 'ADMIN_USERNAME'].map(key => [key, process.env[key]]));
  try {
    delete process.env.RESTAURANT_DOMAIN;
    process.env.RENDER_EXTERNAL_HOSTNAME = 'deployment-test.onrender.com';
    process.env.ADMIN_USERNAME = 'hosted-test-admin';
    const count = await WhitelabelConfigModel.countDocuments();
    await seed();
    const tenant = await WhitelabelConfigModel.findOne({ domain: process.env.RENDER_EXTERNAL_HOSTNAME });
    assert.ok(tenant);
    assert.ok(tenant.domains.includes('deployment-test.onrender.com'));
    assert.equal(await UserModel.countDocuments({ whitelabelId: tenant._id }), 1);
    await seed();
    assert.equal(await WhitelabelConfigModel.countDocuments(), count + 1);
    process.env.RESTAURANT_DOMAIN = 'explicit-host.example';
    process.env.ADMIN_USERNAME = 'explicit-host-admin';
    await seed();
    assert.ok(await WhitelabelConfigModel.exists({ domain: 'explicit-host.example' }));
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test('readiness reports unavailable database without exposing connection details', async () => {
  const database = mongoose.connection.db;
  const original = database.admin;
  database.admin = () => ({ ping: async () => { throw new Error('private connection details'); } });
  try {
    const result = await request('/health', 'GET', undefined, false, 'health-probe.internal');
    assert.equal(result.status, 503);
    assert.equal(result.body.message, 'Database unavailable');
    assert.ok(!JSON.stringify(result.body).includes('private'));
  } finally { database.admin = original; }
});
