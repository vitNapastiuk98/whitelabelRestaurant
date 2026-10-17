import jwt from 'jsonwebtoken'
import { FastifyRequest } from 'fastify'
import { ApiError } from './errors'
import { UserModel, WhitelabelConfigModel } from './db'

export function secret() {
    const value = process.env.JWT_SECRET
    if (!value || value.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters')
    return value
}

export function requestDomain(request: FastifyRequest) {
    const host = request.headers.host || request.hostname
    return new URL(`http://${host}`).hostname.toLowerCase().replace(/\.$/, '')
}
export async function getTenant(request: FastifyRequest) {
    const domain = requestDomain(request)
    const config = await WhitelabelConfigModel.findOne({ $or: [{ domain }, { domains: domain }] })
    if (!config) throw new ApiError(404, 'No restaurant configured for this host')
    return config
}

export async function authorize(request: FastifyRequest, tenant: any) {
    const header = request.headers.authorization
    if (!header?.startsWith('Bearer ')) throw new ApiError(401, 'Please log in')
    let userId: string
    const key = secret()
    try {
        const decoded = jwt.verify(header.slice(7), key, { algorithms: ['HS256'] }) as { userId: string }
        userId = decoded.userId
        if (!/^[a-f\d]{24}$/i.test(userId)) throw new Error('Invalid user')
    } catch { throw new ApiError(401, 'Session expired or invalid') }
    const user = await UserModel.findById(userId)
    if (!user) throw new ApiError(401, 'Session expired or invalid')
    if (String(user.whitelabelId) !== String(tenant._id)) throw new ApiError(403, 'Wrong restaurant')
}

export function publicConfig(config: any) {
    const { _id, domain, domains, colors, theme, logo, name, enabledFeatures, content, contactInfo } = config.toObject()
    return { whitelabelId: String(_id), domain, domains, colors, theme, logo, name, enabledFeatures, content: content || {}, contactInfo }
}
