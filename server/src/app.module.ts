import { Module } from '@nestjs/common'
import { IdentityModule } from './modules/identity/identity.module'
import { WhitelabelModule } from './modules/whitelabel/whitelabel.module'
import { RestaurantModule } from './modules/restaurant/restaurant.module'
import { ReservationsModule } from './modules/reservations/reservations.module'
import { HealthModule } from './modules/health/health.module'

@Module({ imports: [IdentityModule, WhitelabelModule, RestaurantModule, ReservationsModule, HealthModule] })
export class AppModule {}
