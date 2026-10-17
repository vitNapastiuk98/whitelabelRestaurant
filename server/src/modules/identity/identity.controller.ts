import { Body, Controller, Get, HttpCode, Inject, Post, UseGuards } from '@nestjs/common'
import { AdminGuard, CurrentTenant, Tenant, TenantGuard } from '../../common/tenant'
import { JsonBodyPipe } from '../../common/json-body.pipe'
import { IdentityService } from './identity.service'

@Controller('api/auth')
@UseGuards(TenantGuard)
export class AuthController {
    constructor(@Inject(IdentityService) private readonly service: IdentityService) {}
    @Post('login') @HttpCode(200)
    login(@CurrentTenant() tenant: Tenant, @Body(JsonBodyPipe) body: Record<string, unknown>) {
        return this.service.login(tenant, body)
    }
}

@Controller('api/admins')
@UseGuards(TenantGuard, AdminGuard)
export class AdminsController {
    constructor(@Inject(IdentityService) private readonly service: IdentityService) {}
    @Get()
    list(@CurrentTenant() tenant: Tenant) { return this.service.list(tenant) }
    @Post() @HttpCode(200)
    create(@CurrentTenant() tenant: Tenant, @Body(JsonBodyPipe) body: Record<string, unknown>) {
        return this.service.create(tenant, body)
    }
}
