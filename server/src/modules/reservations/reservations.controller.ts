import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, UseGuards } from '@nestjs/common'
import { AdminGuard, CurrentTenant, Tenant, TenantGuard } from '../../common/tenant'
import { JsonBodyPipe } from '../../common/json-body.pipe'
import { ReservationsService } from './reservations.service'

@Controller('api/reservations')
@UseGuards(TenantGuard)
export class ReservationsController {
    constructor(@Inject(ReservationsService) private readonly service: ReservationsService) {}
    @Post() @HttpCode(200)
    create(@CurrentTenant() tenant: Tenant, @Body(JsonBodyPipe) body: Record<string, unknown>) { return this.service.book(tenant, body) }
    @Get() @UseGuards(AdminGuard)
    list(@CurrentTenant() tenant: Tenant) { return this.service.list(tenant, 'reservations') }
    @Get(':id') @UseGuards(AdminGuard)
    find(@CurrentTenant() tenant: Tenant, @Param('id') id: string) { return this.service.find(tenant, 'reservations', id) }
    @Delete(':id') @UseGuards(AdminGuard)
    remove(@CurrentTenant() tenant: Tenant, @Param('id') id: string) { return this.service.remove(tenant, 'reservations', id) }
}

@Controller('api/messages')
@UseGuards(TenantGuard)
export class MessagesController {
    constructor(@Inject(ReservationsService) private readonly service: ReservationsService) {}
    @Post() @HttpCode(200)
    create(@CurrentTenant() tenant: Tenant, @Body(JsonBodyPipe) body: Record<string, unknown>) { return this.service.message(tenant, body) }
    @Get() @UseGuards(AdminGuard)
    list(@CurrentTenant() tenant: Tenant) { return this.service.list(tenant, 'messages') }
    @Get(':id') @UseGuards(AdminGuard)
    find(@CurrentTenant() tenant: Tenant, @Param('id') id: string) { return this.service.find(tenant, 'messages', id) }
    @Delete(':id') @UseGuards(AdminGuard)
    remove(@CurrentTenant() tenant: Tenant, @Param('id') id: string) { return this.service.remove(tenant, 'messages', id) }
}
