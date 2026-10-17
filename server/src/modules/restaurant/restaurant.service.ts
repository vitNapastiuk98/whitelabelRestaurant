import { Injectable } from '@nestjs/common'
import { Tenant } from '../../common/tenant'
import { WhitelabelConfigModel } from '../../lib/db'
import { publicConfig } from '../../lib/auth'
import { validateContent } from '../../lib/validation'

@Injectable()
export class RestaurantService {
    menu(tenant: Tenant) { return tenant.content?.menu || { title: 'Menù', categories: [] } }
    categories(tenant: Tenant) { return tenant.content?.menu?.categories || [] }
    events(tenant: Tenant) { return tenant.content?.events || { title: 'Eventi', events: [] } }
    async update(tenant: Tenant, section: string, body: Record<string, unknown>) {
        const content = validateContent(section, body)
        const updated = await WhitelabelConfigModel.findByIdAndUpdate(tenant._id,
            { $set: { [`content.${section}`]: content } }, { new: true, runValidators: true })
        return publicConfig(updated)
    }
}
