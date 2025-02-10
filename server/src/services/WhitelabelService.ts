import { WhitelabelConfigModel, WhitelabelConfig } from '../models/WhitelabelConfig'

export class WhitelabelService {
    // Fetch whitelabel configuration by domain
    async getConfigByDomain(domain: string) {
        return (WhitelabelConfigModel as any).findOne({ domain })
    }

    // Add a new whitelabel configuration
    async addConfig(config: WhitelabelConfig) {
        const newConfig = new WhitelabelConfigModel(config)
        return newConfig.save()
    }

    // Update an existing whitelabel configuration
    async updateConfig(domain: string, updates: Partial<WhitelabelConfig>) {
        return (WhitelabelConfigModel as any).findOneAndUpdate({ domain }, updates)
    }

    // Remove a whitelabel configuration by domain
    async removeConfig(domain: string) {
        return (WhitelabelConfigModel as any).findOneAndDelete({ domain })
    }
}