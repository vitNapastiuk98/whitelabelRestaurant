import { Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from 'mongoose'
import { connectDB, WhitelabelConfigModel, UserModel, ReservationModel, MessageModel } from './lib/db'
import { authorize, getTenant, publicConfig, requestDomain, secret } from './lib/auth'
import { ApiError, BadRequestError } from './lib/errors'
import { contact, hostname, palette, reservation, text, validateContent } from './lib/validation'

@Injectable()
export class ApiService {
    async handle(request: FastifyRequest) {
        try {
            await connectDB()
            const parts = new URL(request.url, 'http://localhost').pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean)
            const [resource, id] = parts
            if (parts.length > 2) throw new ApiError(404, 'API route not found')
            const method = request.method
            const tenant = await getTenant(request)
            const scope = { whitelabelId: tenant._id }
            const body: any = request.body;
            if (['POST', 'PUT', 'PATCH'].includes(method) && (!body || typeof body !== 'object' || Array.isArray(body))) {
                throw new BadRequestError('Invalid JSON object');
            }
            const ok = (value: any) => ({ status: 200, body: value });
            if (resource === 'auth' && id === 'login' && method === 'POST') {
                const username = text(body.username, 'username', 120)
                const password = body.password
                if (typeof password !== 'string' || !password.length || password.length > 200) {
                    throw new BadRequestError('Invalid password')
                }
                const user = await UserModel.findOne({ username, ...scope }).select('+password')
                if (!user || !await bcrypt.compare(password, user.password)) throw new ApiError(401, 'Invalid credentials')
                return ok({ token: jwt.sign({ userId: String(user._id) }, secret(), { expiresIn: '1h', algorithm: 'HS256' }) })
            }
            const publicRead = method === 'GET' && ['whitelabel', 'menu', 'menu-categories', 'events'].includes(resource)
            const publicWrite = method === 'POST' && !id && ['reservations', 'messages'].includes(resource)
            if (!publicRead && !publicWrite) await authorize(request, tenant)
            if (resource === 'admins' && !id) {
                const safeAdmin = (user: any) => ({ _id: String(user._id), username: user.username, createdAt: user.createdAt })
                if (method === 'GET') return ok((await UserModel.find(scope).sort({ createdAt: 1 })).map(safeAdmin))
                if (method === 'POST') {
                    const username = text(body.username, 'username', 80)
                    if (!/^[A-Za-z0-9_.-]{3,80}$/.test(username)) throw new BadRequestError('Username must contain 3–80 letters, digits, dots, underscores or hyphens')
                    const password = body.password
                    if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
                        throw new BadRequestError('Password must contain at least 12 characters and at most 72 UTF-8 bytes')
                    }
                    const user = await UserModel.create({ username, password: await bcrypt.hash(password, 12), ...scope })
                    return ok(safeAdmin(user))
                }
                throw new ApiError(405, 'Method not allowed')
            }
            if (resource === 'whitelabel' && id === 'domain' && method === 'PUT') {
                const domain = hostname(body.domain)
                if (!Array.isArray(body.aliases) || body.aliases.length > 20) throw new BadRequestError('Provide at most 20 aliases')
                const domains = [...new Set([domain, ...body.aliases.map(hostname), requestDomain(request)])]
                const updated = await WhitelabelConfigModel.findByIdAndUpdate(tenant._id,
                    { $set: { domain, domains } }, { new: true, runValidators: true })
                return ok(publicConfig(updated))
            }
            if (resource === 'whitelabel' && !id) {
                if (method === 'GET') return ok(publicConfig(tenant))
                if (method === 'PUT') {
                    tenant.name = text(body.name, 'restaurant name', 120)
                    if (body.colors !== undefined) tenant.colors = palette(body.colors)
                    if (body.contactInfo !== undefined) {
                        const info = body.contactInfo
                        if (!info || typeof info !== 'object') throw new BadRequestError('Invalid contact info')
                        const email = text(info.email ?? '', 'email', 254, false)
                        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestError('Invalid email')
                        tenant.contactInfo = { address: text(info.address ?? '', 'address', 500, false),
                            phone: text(info.phone ?? '', 'phone', 40, false), email }
                    }
                    await tenant.save()
                    return ok(publicConfig(tenant))
                }
            }
            if (resource === 'content' && id && method === 'PUT') {
                const content = validateContent(id, body)
                const updated = await WhitelabelConfigModel.findByIdAndUpdate(tenant._id,
                    { $set: { [`content.${id}`]: content } }, { new: true, runValidators: true })
                return ok(publicConfig(updated))
            }
            if (method === 'GET' && !id) {
                if (resource === 'menu') return ok(tenant.content?.menu || { title: 'Menù', categories: [] });
                if (resource === 'menu-categories') return ok(tenant.content?.menu?.categories || []);
                if (resource === 'events') return ok(tenant.content?.events || { title: 'Eventi', events: [] });
            }
            const models: Record<string, any> = { reservations: ReservationModel, messages: MessageModel };
            const model = Object.hasOwn(models, resource) ? models[resource] : undefined
            if (!model) throw new ApiError(404, 'API route not found')
            if (id && !isValidObjectId(id)) throw new BadRequestError('Invalid ID')
            const filter = { ...scope, ...(id ? { _id: id } : {}) }
            if (method === 'GET') {
                if (id) {
                    const item = await model.findOne(filter)
                    if (!item) throw new ApiError(404, 'Item not found')
                    return ok(item)
                }
                return ok(await model.find(filter).sort(resource === 'reservations' ? { date: 1, time: 1 } : { _id: -1 }))
            }
            if (method === 'DELETE' && id) {
                const item = await model.findOneAndDelete(filter)
                if (!item) throw new ApiError(404, 'Item not found')
                return ok({ deleted: true })
            }
            let values: any
            if (resource === 'reservations' && method === 'POST') values = reservation(body)
            if (resource === 'messages' && method === 'POST') {
                values = { ...contact(body), message: text(body.message, 'message', 10000) }
                text(values.email, 'email', 254)
            }
            if (values && method === 'POST' && !id) {
                const saved = await model.create({ ...values, ...scope })
                return ok(resource === 'messages' ? { id: saved._id } : saved)
            }
            throw new ApiError(405, 'Method not allowed')
        } catch (error: any) {
            const status = error.code === 11000 ? 409 : error instanceof ApiError ? error.status : ['ValidationError', 'CastError'].includes(error.name) ? 400 : 500
            if (status === 500) console.error(error)
            return { status, body: { message: status === 409 ? 'Username or domain is already in use' : status === 500 ? 'An unexpected error occurred' : error.message } };
        }
    }
}
