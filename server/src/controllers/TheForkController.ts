import { Controller, Get, Param, Query } from 'routing-controllers'
import { TheForkService } from '../services/TheForkService'

@Controller('/the-fork')
export class TheForkController {
    private theForkService = new TheForkService()

    @Get('/restaurants/:id')
    async getRestaurantDetails(@Param('id') restaurantId: string) {
        return this.theForkService.getRestaurantDetails(restaurantId)
    }

    @Get('/restaurants/:id/reservations')
    async getRestaurantReservations(@Param('id') restaurantId: string) {
        return this.theForkService.getRestaurantReservations(restaurantId)
    }

    @Get('/restaurants/:id/availability')
    async getRestaurantAvailability(
        @Param('id') restaurantId: string,
        @Query('date') date: string,
        @Query('partySize') partySize: number
    ) {
        return this.theForkService.getRestaurantAvailability(restaurantId, date, partySize)
    }
}