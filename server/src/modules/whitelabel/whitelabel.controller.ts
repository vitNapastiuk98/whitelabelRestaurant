import { Body, Controller, Get, Inject, Put, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { AdminGuard, CurrentTenant, Tenant, TenantGuard } from '../../common/tenant'
import { JsonBodyPipe } from '../../common/json-body.pipe'
import { requestDomain } from '../../lib/auth'
import { WhitelabelService } from './whitelabel.service'

@Controller('api/whitelabel')
@UseGuards(TenantGuard)
export class WhitelabelController {
    constructor(@Inject(WhitelabelService) private readonly service: WhitelabelService) {}
    @Get()
    read(@CurrentTenant() tenant: Tenant) { return this.service.read(tenant) }
    @Put() @UseGuards(AdminGuard)
    update(@CurrentTenant() tenant: Tenant, @Body(JsonBodyPipe) body: Record<string, unknown>) {
        return this.service.update(tenant, body)
    }
    @Put('domain') @UseGuards(AdminGuard)
    updateDomain(@CurrentTenant() tenant: Tenant, @Body(JsonBodyPipe) body: Record<string, unknown>, @Req() request: FastifyRequest) {
        return this.service.updateDomain(tenant, body, requestDomain(request))
    }
}
