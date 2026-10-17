import { Body, Controller, Get, Inject, Param, Put, UseGuards } from '@nestjs/common'
import { AdminGuard, CurrentTenant, Tenant, TenantGuard } from '../../common/tenant'
import { JsonBodyPipe } from '../../common/json-body.pipe'
import { RestaurantService } from './restaurant.service'

@Controller('api')
@UseGuards(TenantGuard)
export class RestaurantController {
    constructor(@Inject(RestaurantService) private readonly service: RestaurantService) {}
    @Get('menu')
    menu(@CurrentTenant() tenant: Tenant) { return this.service.menu(tenant) }
    @Get('menu-categories')
    categories(@CurrentTenant() tenant: Tenant) { return this.service.categories(tenant) }
    @Get('events')
    events(@CurrentTenant() tenant: Tenant) { return this.service.events(tenant) }
    @Put('content/:section') @UseGuards(AdminGuard)
    update(@CurrentTenant() tenant: Tenant, @Param('section') section: string, @Body(JsonBodyPipe) body: Record<string, unknown>) {
        return this.service.update(tenant, section, body)
    }
}
