import bcrypt from 'bcryptjs'
import { WhitelabelConfigModel, UserModel, MenuCategoryModel, MenuItemModel, EventModel, FileDocumentModel } from './db'
import { secret } from './auth'

export async function seed() {
    secret()
    const domain = (process.env.RESTAURANT_DOMAIN || process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost').toLowerCase()
    let tenant = await WhitelabelConfigModel.findOne({ $or: [{ domain }, { domains: domain }] })
    const username = process.env.ADMIN_USERNAME || 'admin'
    if (!tenant) {
        const admin = await UserModel.findOne({ username })
        if (admin) {
            tenant = await WhitelabelConfigModel.findById(admin.whitelabelId)
            if (!tenant) throw new Error('Configured admin has no restaurant; refusing to create a replacement')
        }
    }
    const defaults = {
            home: { items: [{ file: '/hero-spaghetti.jpg', text1: 'Ingredienti Autentici.', text2: 'Piatti Incredibili.' },
                { file: '/branzino.png', text1: 'Un viaggio nei sapori', text2: 'Qualità e passione, ogni giorno' }] },
            about: { title: 'La nostra storia', caption: 'Qualità e passione', tag1: '20+ anni di esperienza', tag2: '10+ premi e certificati',
                content: 'Fondato nel 2004 dal sogno di due fratelli, Er Spaghetto nasce dalla passione per la cucina autentica e dai sapori della tradizione italiana. Oggi la tradizione continua con ingredienti freschi e piatti preparati con dedizione.', image: '/chef-plating.png' },
            menu: { title: 'Menù', description: 'I sapori della tradizione italiana.', categories: [
                { name: 'Antipasti', items: [{ name: 'Bruschetta al pomodoro e basilico', price: 12.9, photo: '/bruschette.png', allergens: 'Glutine' }] },
                { name: 'Primi', items: [{ name: 'Spaghetti alla carbonara', price: 14.5, photo: '/carbonara.png', allergens: 'Uova, latte, glutine' }] },
                { name: 'Secondi', items: [{ name: 'Branzino al limone', price: 18, photo: '/branzino.png', allergens: 'Pesce' }] },
            ] },
            events: { title: 'Jazz Events', subtitle: 'Musica e buona cucina.', events: [
                { title: 'Thursday Jazz Night', description: 'Una serata di musica dal vivo.', date: 'Ogni giovedì alle 21:00', photo: '/jazz.jpg' }] },
            specialties: { specialties: [{ name: 'Spaghetti alla carbonara', photo: '/carbonara.png', menuLink: '/menu' },
                { name: 'Branzino al limone', photo: '/branzino.png', menuLink: '/menu' },
                { name: 'Tiramisù classico', photo: '/tiramisu.png', menuLink: '/menu' }] },
        }
    if (!tenant) tenant = await WhitelabelConfigModel.create({ domain, name: 'Er Spaghetto', theme: 'default-theme',
        contactInfo: { address: 'C.so Giulio Cesare 98, Roma', phone: '+39 385 825 8955', email: 'info@erspaghetto.it' },
        content: defaults,
    })
    const missing: Record<string, any> = {};
    for (const [section, value] of Object.entries(defaults)) {
        if (tenant.content?.[section] === undefined) missing[`content.${section}`] = value;
    }
    const files = missing['content.menu'] || missing['content.events']
        ? await FileDocumentModel.find({ whitelabelId: tenant._id }).lean() : [];
    const photos = new Map(files.map((file: any) => [String(file._id), file.path]));
    const photo = (reference: any) => {
        const value = photos.get(String(reference)) || String(reference || '');
        return /^(\/[^/]|https:\/\/)/.test(value) ? value : null;
    };
    const menuItem = (item: any) => ({ name: item.name, price: item.price, description: item.description || '',
        allergens: item.allergens || '', photo: photo(item.photo) });
    if (missing['content.menu']) {
        const categories = await MenuCategoryModel.find({ whitelabelId: tenant._id }).lean();
        const items = await MenuItemModel.find({ whitelabelId: tenant._id }).lean();
        if (categories.length || items.length) {
            const grouped = categories.map((category: any) => ({ name: category.name,
                items: items.filter((item: any) => String(item.category) === String(category._id))
                    .map(menuItem) }));
            const ungrouped = items.filter((item: any) => !categories.some((category: any) => String(category._id) === String(item.category)));
            if (ungrouped.length) grouped.push({ name: 'Menù', items: ungrouped.map(menuItem) });
            missing['content.menu'] = { title: 'Menù', description: '', categories: grouped };
        }
    }
    if (missing['content.events']) {
        const events = await EventModel.find({ whitelabelId: tenant._id }).lean();
        if (events.length) missing['content.events'] = { title: 'Eventi', subtitle: '', events: events.map((event: any) => ({
            title: event.title, description: event.description || '', date: new Date(event.date).toISOString(), photo: photo(event.image),
        })) };
    }
    if (Object.keys(missing).length) await WhitelabelConfigModel.updateOne({ _id: tenant._id }, { $set: missing });
    if (await UserModel.exists({ whitelabelId: tenant._id })) return;
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 12) throw new Error('Set ADMIN_PASSWORD to at least 12 characters before seeding');
    await UserModel.create({ username, password: await bcrypt.hash(password, 12), whitelabelId: tenant._id });
}
