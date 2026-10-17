import { Injectable } from '@nestjs/common'
import { WhitelabelConfigModel } from '../../lib/db'
import { publicConfig } from '../../lib/auth'
import { BadRequestError } from '../../lib/errors'
import { hostname, palette, text } from '../../lib/validation'
import { Tenant } from '../../common/tenant'

@Injectable()
export class WhitelabelService {
    read(tenant: Tenant) { return publicConfig(tenant) }

    async update(tenant: Tenant, body: Record<string, unknown>) {
        tenant.name = text(body.name, 'restaurant name', 120)
        if (body.colors !== undefined) tenant.colors = palette(body.colors)
        if (body.contactInfo !== undefined) {
            const info = body.contactInfo
            if (!info || typeof info !== 'object' || Array.isArray(info)) throw new BadRequestError('Invalid contact info')
            const details = info as Record<string, unknown>
            const email = text(details.email ?? '', 'email', 254, false)
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestError('Invalid email')
            tenant.contactInfo = { address: text(details.address ?? '', 'address', 500, false), phone: text(details.phone ?? '', 'phone', 40, false), email }
        }
        await tenant.save()
        return publicConfig(tenant)
    }

    async updateDomain(tenant: Tenant, body: Record<string, unknown>, currentHost: string) {
        const domain = hostname(body.domain)
        if (!Array.isArray(body.aliases) || body.aliases.length > 20) throw new BadRequestError('Provide at most 20 aliases')
        const domains = [...new Set([domain, ...body.aliases.map(hostname), currentHost])]
        const updated = await WhitelabelConfigModel.findByIdAndUpdate(tenant._id,
            { $set: { domain, domains } }, { new: true, runValidators: true })
        return publicConfig(updated)
    }
}
