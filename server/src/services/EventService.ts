import { EventModel, Event } from '../models/Event'

export class EventService {
    async getEvents(whitelabelId: string) {
        return (EventModel as any).find({ whitelabelId })
    }

    async addEvent(event: Event) {
        const newEvent = new EventModel(event)
        return newEvent.save()
    }

    async removeEvent(id: string, whitelabelId: string) {
        return (EventModel as any).findOneAndDelete({ _id: id, whitelabelId })
    }
}