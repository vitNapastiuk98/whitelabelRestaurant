import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../../lib/db'
import { secret } from '../../lib/auth'
import { ApiError, BadRequestError } from '../../lib/errors'
import { text } from '../../lib/validation'
import { Tenant } from '../../common/tenant'

@Injectable()
export class IdentityService {
    async login(tenant: Tenant, body: Record<string, unknown>) {
        const username = text(body.username, 'username', 120)
        const password = body.password
        if (typeof password !== 'string' || !password.length || password.length > 200) throw new BadRequestError('Invalid password')
        const user = await UserModel.findOne({ username, whitelabelId: tenant._id }).select('+password')
        if (!user || !await bcrypt.compare(password, user.password)) throw new ApiError(401, 'Invalid credentials')
        return { token: jwt.sign({ userId: String(user._id) }, secret(), { expiresIn: '1h', algorithm: 'HS256' }) }
    }

    async list(tenant: Tenant) {
        return (await UserModel.find({ whitelabelId: tenant._id }).sort({ createdAt: 1 })).map(user => this.publicAdmin(user))
    }

    async create(tenant: Tenant, body: Record<string, unknown>) {
        const username = text(body.username, 'username', 80)
        if (!/^[A-Za-z0-9_.-]{3,80}$/.test(username)) throw new BadRequestError('Username must contain 3–80 letters, digits, dots, underscores or hyphens')
        const password = body.password
        if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
            throw new BadRequestError('Password must contain at least 12 characters and at most 72 UTF-8 bytes')
        }
        const user = await UserModel.create({ username, password: await bcrypt.hash(password, 12), whitelabelId: tenant._id })
        return this.publicAdmin(user)
    }

    private publicAdmin(user: { _id: unknown; username: string; createdAt?: Date }) {
        return { _id: String(user._id), username: user.username, createdAt: user.createdAt }
    }
}
