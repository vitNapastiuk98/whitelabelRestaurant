# Whitelabel Restaurant

Angular 22.2.3 restaurant website and admin, backed by **NestJS 12.1.3 with Fastify 5** and MongoDB. The backend serves the Angular production build and a same-origin `/api` API. Requires Node.js 22.22.3+ (22 LTS), 24.15.0+, or 26+, and npm.

Implemented: editable home/about/menu/specialties/events with saved images, admin login/logout, restaurant contact and color settings, additional admin accounts, hostname/alias routing, guest reservation requests, contact messages, and admin booking/message views. Requests and private data are scoped to the restaurant's hostname.

## Run locally

Install both applications:

```sh
npm ci --prefix client
npm ci --prefix server
cp server/.env.example server/.env
```

Edit `server/.env`: set `ADMIN_PASSWORD` to a unique password of at least 12 characters and `JWT_SECRET` to a random secret of at least 32 characters (`openssl rand -hex 32` generates one). Keep these private. `RESTAURANT_DOMAIN` defaults to `localhost`; use that hostname when opening the website.

Start MongoDB, either your existing instance/Atlas database via `MONGODB_URI`, or the included persistent local container:

```sh
docker compose up -d
```

Build and run the complete application from the repository root:

```sh
npm run build
npm start
```

Open **http://localhost:3000**, or **http://localhost:3000/admin/login** for the admin. The initial username is `admin` (override with `ADMIN_USERNAME`); the password is the value you set. `PORT` and `HOST` override the server's default `3000` and `127.0.0.1`. Set `HOST=0.0.0.0` when running behind a container or remote reverse proxy.

For development, run these in separate terminals:

```sh
npm --prefix server run dev
npm --prefix client start
```

Open http://localhost:4200. Angular proxies `/api` to Nest on port 3000. If you change the backend port, update `client/proxy.conf.json` too.

## Publish on the free tier

The repository includes a multi-stage `Dockerfile` and `render.yaml` Blueprint for **one free Render web service** serving both Angular and NestJS. MongoDB lives in a separate **MongoDB Atlas Free cluster**, so reservations, content, images, and accounts survive redeploys and service sleep. Use the included `.onrender.com` address for a free URL; purchasing a custom domain is separate.

1. Connect this GitHub repository to Render, and create an Atlas **Free** cluster (avoid a paid tier).
2. Create a database user restricted to the restaurant database and allow the Render service's outbound IP ranges in Atlas Network Access. Use the same region where available.
3. Create a Render Blueprint from this repository and its deployment branch. Keep the service on **Free**. Enter the Atlas connection string as `MONGODB_URI`, including the database name. Keep this secret in Render, never in Git or chat.
4. Render generates `JWT_SECRET` and `ADMIN_PASSWORD`; the initial username is `admin`. Retrieve the password privately from the service's environment settings.
5. Deploy and open the assigned URL. `/api/health` checks the database independently of the Host header. `/admin/login` opens the admin.

`HOST=0.0.0.0` is set in the container; Render supplies `PORT` and `RENDER_EXTERNAL_HOSTNAME`. Leave `RESTAURANT_DOMAIN` unset for the first deployment so the seed uses the assigned Render hostname. If adding your own domain later, configure it in both Render and **Impostazioni → Dominio**. Render manages HTTPS certificates for configured domains. Auto-deploy is disabled in the Blueprint; trigger reviewed deployments manually.

Render Free sleeps after 15 minutes without inbound traffic, and waking it takes about a minute. Usage limits apply, and the free service is intended for demos/hobby use rather than a dependable live restaurant booking system. See [Render Free limits](https://render.com/docs/free) and [Atlas Free limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/). No paid plan or domain purchase is needed for the demo setup. If transferring an existing restaurant, migrate its database separately; first deployment initializes a fresh database and does not upload local data automatically.

For a local production-image check:

```sh
docker build -t whitelabel-restaurant .
docker run --rm -p 3000:3000 --env-file server/.env -e HOST=0.0.0.0 -e MONGODB_URI=mongodb://host.docker.internal:27017/restaurant whitelabel-restaurant
```

## Backend architecture

Nest's `AppModule` composes feature modules for **identity**, **whitelabel**, **restaurant content**, **reservations/messages**, and **health** under `server/src/modules`. Each business feature owns its controllers and services. Controllers declare native HTTP routes; services own validation and database operations. Shared `TenantGuard`, `AdminGuard`, and `CurrentTenant` bind requests to the hostname's restaurant before protected handlers run. A JSON-body pipe validates request shape, and the API error filter returns safe errors. `server/src/lib` holds the shared database schema, existing validation, token helpers, and idempotent seed/migration code. Collection names and existing stored data are preserved.

## Frontend architecture

The Angular 22 application runs without Zone.js and keeps business ownership in feature folders:

| Folder | Responsibility |
| --- | --- |
| `client/src/app/features/restaurant` | Public content, menu, contact form, and content editor |
| `client/src/app/features/identity` | Login, session state, and route guards |
| `client/src/app/features/reservations` | Guest booking, reservations, and message inbox |
| `client/src/app/features/whitelabel` | Branding, domain configuration, and administrator management |
| `client/src/app/shared` | Reusable signal form controls and site layout |
| `client/src/app/core/http` | Authentication interceptor |

Features separate domain contracts, data access, and pages where needed. Domain models do not depend on UI components. Routes load pages lazily, and admin child routes check authentication. Signals and computed values drive UI state; `httpResource` handles configuration, administrator lists, reservations, and messages with loading/error/retry states. Writes remain explicit HTTP commands. All editable forms use `@angular/forms/signals`, including nested content editors and the image upload control.

Run the frontend tests with Chrome installed:

```sh
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm --prefix client test -- --watch=false --browsers=ChromeHeadless
```

## Data and accounts

Startup seeds the configured hostname and its first admin. Repeated starts preserve existing users, passwords, reservations and edited content. Missing content sections are initialized; existing menu items/categories and events are copied into the editable sections without deleting the original records. Back up an existing database before upgrading and set `RESTAURANT_DOMAIN` to its configured domain. Domains must be lower-case hostnames without a scheme or port.

An existing admin password is never reset from environment variables. Admin signup is intentionally unavailable: `/admin/signup` redirects to login. To provision another restaurant, run `npm --prefix server run seed` with its domain, a distinct `ADMIN_USERNAME`, and password in the environment. Old accounts seeded with `admin123` should be changed before exposing the service.

Public content now lives in `whitelabelconfigs.content`; edits use `/api/content/:section`. The older individual menu/category/event write endpoints have been retired so there is one source of truth. Existing MongoDB collection names and archived records are retained.

## Whitelabel configuration

Open **http://localhost:3000/admin/settings** after signing in, or choose **Impostazioni** in the admin navigation.

- **Restaurant and appearance:** edit contact details and the primary, background, text, and button colors. Saved colors apply to the website immediately and survive reloads. Text on colored panels/buttons automatically uses black or white for readability.
- **Domains:** set a primary hostname and additional aliases. Enter hostnames only, without `https://`, paths, or ports. The current hostname is retained when you change the primary, so you can continue administering the restaurant. Names already assigned to another restaurant cannot be claimed.
- **Administrators:** view this restaurant’s admins and create another account. New usernames use 3–80 letters, digits, dots, underscores, or hyphens. Passwords require at least 12 characters and must fit within bcrypt’s 72-byte limit. Every account can manage this restaurant’s content and settings; roles, account deletion, and password reset are not included.

Saving a domain configures application routing; it does not register a domain or change DNS. For a public hostname, point its DNS at the hosting server and configure HTTPS/reverse-proxy forwarding while preserving the original Host header. For local testing, an alias such as `demo.localhost` can access the same running app at `http://demo.localhost:3000`.

## API

| Method | Endpoint | Access / result |
| --- | --- | --- |
| GET | `/api/whitelabel` | Current restaurant configuration and public content; excludes integration secrets |
| POST | `/api/auth/login` | `{ username, password }` → one-hour bearer token |
| PUT | `/api/whitelabel` | Admin: `{ name, contactInfo: { address, phone, email }, colors: { primary, background, text, button } }` |
| PUT | `/api/whitelabel/domain` | Admin: `{ domain, aliases: string[] }` → updated public config |
| GET / POST | `/api/admins` | Admin: list accounts / create `{ username, password }`; no passwords or hashes in responses |
| PUT | `/api/content/:section` | Admin: `home`, `about`, `menu`, `specialties`, or `events` section |
| GET | `/api/health` | Public: database readiness, independent of tenant hostname |
| GET | `/api/menu`, `/api/menu-categories`, `/api/events` | Published menu, categories, or event section |
| POST | `/api/reservations` | Guest: `{ name, phone, email?, date: "YYYY-MM-DD", time: "HH:mm", guests, consent: true }` |
| GET / DELETE | `/api/reservations`, `/api/reservations/:id` | Admin: list / remove requests |
| POST | `/api/messages` | Guest: `{ name, email, phone, message, consent: true }` |
| GET | `/api/messages` | Admin: received messages |

Admin requests use `Authorization: Bearer <token>`. Primary hostnames and aliases resolve tenants on the server; client-supplied tenant IDs are ignored. Images accept PNG/JPEG/WebP/GIF up to 1 MB each and persist as data URLs within MongoDB’s 16 MB limit for the whole restaurant document; use object storage for larger image libraries. The admin session lasts for the browser tab's session and expires after one hour.

## Checks

```sh
npm test
npm --prefix client test -- --watch=false --browsers=ChromeHeadless
npm run build
```

Backend tests start a disposable MongoDB automatically using `mongodb-memory-server` and exercise the Nest/Fastify HTTP pipeline. The first run downloads a MongoDB binary. Frontend tests require Chrome; set `CHROME_BIN` if it is not found automatically.

## Current limits

Bookings are requests for staff to review; this version does not enforce table capacity or send email/SMS confirmations. Contact messages are stored for staff rather than emailed. The UI is Italian; automated translations and TheFork integration are not enabled. Before a public deployment, configure your real restaurant details, HTTPS, database access/backups, and reverse-proxy rate limits for login and guest submissions. Hosting has not been deployed by this change.
