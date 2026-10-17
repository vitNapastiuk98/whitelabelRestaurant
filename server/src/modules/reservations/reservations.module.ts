import { Module } from '@nestjs/common'
import { ReservationsController, MessagesController } from './reservations.controller'
import { ReservationsService } from './reservations.service'

@Module({ controllers: [ReservationsController, MessagesController], providers: [ReservationsService] })
export class ReservationsModule {}
