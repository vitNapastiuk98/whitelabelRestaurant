import { Controller, Get, Post, Body, Param, Delete, Authorized } from 'routing-controllers'
import { ReservationService } from '../services/ReservationService'
import { Reservation } from '../models/Reservation'

@Controller('/reservations')
export class ReservationController {
    private reservationService = new ReservationService()

    @Get()
    @Authorized() // Only authenticated users can access this route
    async getReservations() {
        return this.reservationService.getReservations()
    }

    @Post()
    async addReservation(@Body() reservation: Reservation) {
        return this.reservationService.addReservation(reservation)
    }

    @Delete('/:id')
    @Authorized()
    async removeReservation(@Param('id') id: string) {
        return this.reservationService.removeReservation(id)
    }
}