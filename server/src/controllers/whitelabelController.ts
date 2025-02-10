import { Controller, Get, Post, Body, Param, Put, Delete, Authorized } from 'routing-controllers'
import { WhitelabelService } from '../services/WhitelabelService'
import { WhitelabelConfig } from '../models/WhitelabelConfig'

@Controller('/whitelabel')
export class WhitelabelController {
    private whitelabelService = new WhitelabelService()

    @Get('/:domain')
    async getConfigByDomain(@Param('domain') domain: string) {
        return this.whitelabelService.getConfigByDomain(domain)
    }

    @Post()
    @Authorized() // Only authenticated users (admins) can add configurations
    async addConfig(@Body() config: WhitelabelConfig) {
        return this.whitelabelService.addConfig(config)
    }

    @Put('/:domain')
    @Authorized()
    async updateConfig(@Param('domain') domain: string, @Body() updates: Partial<WhitelabelConfig>) {
        return this.whitelabelService.updateConfig(domain, updates)
    }

    @Delete('/:domain')
    @Authorized()
    async removeConfig(@Param('domain') domain: string) {
        return this.whitelabelService.removeConfig(domain)
    }
}