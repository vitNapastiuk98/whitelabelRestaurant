import {Controller, Get, Post, Body, Param, Delete, Authorized, CookieParam} from 'routing-controllers'
import { EventService } from '../services/EventService'
import { Event } from '../models/Event'

@Controller('/events')
export class EventController {
    private eventService = new EventService()

    @Get()
    async getEvents( @CookieParam('whitelabelId') whitelabelId: string) {
        return this.eventService.getEvents(whitelabelId)
    }

    @Post()
    @Authorized()
    async addEvent(@Body() event: Event) {
        return this.eventService.addEvent(event)
    }

    @Delete('/:id')
    @Authorized()
    async removeEvent(@Param('id') id: string, @CookieParam('whitelabelId') whitelabelId: string) {
        return this.eventService.removeEvent(id, whitelabelId)
    }
}