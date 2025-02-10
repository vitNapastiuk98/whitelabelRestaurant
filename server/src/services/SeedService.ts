// src/services/SeedService.ts
import { WhitelabelConfigModel } from '../models/WhitelabelConfig'
import { UserModel } from '../models/User'
import { MenuItemModel } from '../models/MenuItem'
import { EventModel } from '../models/Event'
import { ReservationModel } from '../models/Reservation'

export class SeedService {
    async seedInitialData() {
        // Create whitelabel config if none exists
        const existingConfig = await (WhitelabelConfigModel as any).findOne()
        if (!existingConfig) {
            const whitelabel = await (WhitelabelConfigModel as any).create({
                domain: 'default.localhost',
                theme: 'default-theme',
                enabledFeatures: {
                    menu: true,
                    events: true,
                    reservations: true,
                    theFork: false
                }
            }) as any

            // Create admin user
            await UserModel.create({
                username: 'admin',
                password: 'admin123',
                whitelabelId: whitelabel._id
            } as any, {ordered: true, aggregateErrors: true})

            // Create sample menu
            await (MenuItemModel as any).create([
                { name: 'Pizza', description: 'Classic Italian', price: 12.99, category: 'Main', whitelabelId: whitelabel._id },
                { name: 'Pasta', description: 'Homemade sauce', price: 14.99, category: 'Main', whitelabelId: whitelabel._id }
            ])

            // Create sample events
            await (EventModel as any).create([
                { title: 'Wine Tasting', description: 'Premium wines', date: new Date(), whitelabelId: whitelabel._id }
            ])

            // Create sample reservations
            await (ReservationModel as any).create([
                { date: new Date(), time: '19:00', guests: 4, whitelabelId: whitelabel._id }
            ])
        }
    }
}