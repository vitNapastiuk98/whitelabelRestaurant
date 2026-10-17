import { BadRequestError } from './errors'

export function hostname(value: unknown): string {
    const domain = text(value, 'domain', 253).toLowerCase().replace(/\.$/, '')
    if (!domain.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
        throw new BadRequestError('Invalid domain: use a hostname without a scheme, path or port')
    }
    return domain
}

export function palette(value: any) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BadRequestError('Invalid colors')
    const result: Record<string, string> = {}
    for (const key of ['primary', 'background', 'text', 'button']) {
        if (typeof value[key] !== 'string' || !/^#[a-f\d]{6}$/i.test(value[key])) throw new BadRequestError(`Invalid ${key} color`)
        result[key] = value[key]
    }
    return result
}

export function text(value: unknown, field: string, max = 500, required = true): string {
    if (typeof value !== 'string' || value.length > max || (required && !value.trim())) {
        throw new BadRequestError(`Invalid ${field}`)
    }
    return value.trim()
}

export function contact(body: any) {
    if (!body || body.consent !== true) throw new BadRequestError('Consent is required')
    const email = text(body.email ?? '', 'email', 254, false)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestError('Invalid email')
    return { name: text(body.name, 'name', 120), phone: text(body.phone, 'phone', 40), email }
}

export function reservation(body: any) {
    const details = contact(body)
    const date = text(body.date, 'date', 10)
    const parsed = new Date(`${date}T00:00:00Z`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== date || new Date(`${date}T23:59:59`) < today) {
        throw new BadRequestError('Choose a valid future date')
    }
    if (typeof body.time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time)) {
        throw new BadRequestError('Invalid time')
    }
    if (!Number.isInteger(body.guests) || body.guests < 1 || body.guests > 50) {
        throw new BadRequestError('Guests must be between 1 and 50')
    }
    return { ...details, date: parsed, time: body.time, guests: body.guests }
}

export function validateContent(section: string, data: any) {
    const object = (value: any) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BadRequestError('Invalid content')
    }
    const list = (value: any, max = 100) => {
        if (!Array.isArray(value) || value.length > max) throw new BadRequestError('Invalid content list')
        return value
    }
    const image = (value: any) => {
        if (value == null || value === '') return null
        if (typeof value !== 'string' || value.length > 1500000 ||
            !(/^(\/[^/]|https:\/\/)/.test(value) || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value))) {
            throw new BadRequestError('Use a PNG, JPEG, WebP or GIF image under 1 MB')
        }
        return value
    }
    object(data)
    switch (section) {
        case 'home': return { items: list(data.items, 10).map(item => {
            object(item)
            return { text1: text(item.text1, 'title', 250), text2: text(item.text2 ?? '', 'subtitle', 500, false), file: image(item.file) }
        }) }
        case 'about': return {
            title: text(data.title, 'title', 250), caption: text(data.caption ?? '', 'caption', 500, false),
            content: text(data.content, 'content', 10000), tag1: text(data.tag1 ?? '', 'tag', 250, false),
            tag2: text(data.tag2 ?? '', 'tag', 250, false), image: image(data.image),
        }
        case 'menu': return { title: text(data.title, 'title', 250), description: text(data.description ?? '', 'description', 2000, false),
            categories: list(data.categories, 30).map(category => {
                object(category)
                return { name: text(category.name, 'category', 120), items: list(category.items).map(item => {
                    object(item)
                    if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0 || item.price > 10000) {
                        throw new BadRequestError('Invalid price')
                    }
                    return { name: text(item.name, 'item name', 250), price: item.price,
                        ...(item.description === undefined ? {} : { description: text(item.description, 'description', 2000, false) }),
                        ...(item.allergens === undefined ? {} : { allergens: text(item.allergens, 'allergens', 500, false) }),
                        ...(item.photo === undefined ? {} : { photo: image(item.photo) }) }
                }) }
            }) }
        case 'events': return { title: text(data.title, 'title', 250), subtitle: text(data.subtitle ?? '', 'subtitle', 2000, false),
            events: list(data.events).map(event => {
                object(event)
                return { title: text(event.title, 'event title', 250), description: text(event.description ?? '', 'description', 2000, false),
                    date: text(event.date, 'event date', 120), photo: image(event.photo) }
            }) }
        case 'specialties': return { specialties: list(data.specialties, 12).map(item => {
            object(item)
            const menuLink = text(item.menuLink ?? '/menu', 'menu link', 500, false)
            if (menuLink && !/^\/(?!\/)/.test(menuLink)) throw new BadRequestError('Use a local menu link')
            return { name: text(item.name, 'specialty', 250), photo: image(item.photo), menuLink }
        }) }
        default: throw new BadRequestError('Unknown content section')
    }
}
