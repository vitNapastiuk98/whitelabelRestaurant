import { Injectable } from '@nestjs/common'
import { isValidObjectId } from 'mongoose'
import { Tenant } from '../../common/tenant'
import { ReservationModel, MessageModel } from '../../lib/db'
import { ApiError, BadRequestError } from '../../lib/errors'
import { contact, reservation, text } from '../../lib/validation'

type Collection = 'reservations' | 'messages'

@Injectable()
export class ReservationsService {
    async list(tenant: Tenant, collection: Collection) {
        const model = collection === 'reservations' ? ReservationModel : MessageModel
        return model.find({ whitelabelId: tenant._id }).sort(collection === 'reservations' ? { date: 1, time: 1 } : { _id: -1 })
    }
    async find(tenant: Tenant, collection: Collection, id: string) {
        const model = collection === 'reservations' ? ReservationModel : MessageModel
        const item = await model.findOne(this.filter(tenant, id))
        if (!item) throw new ApiError(404, 'Item not found')
        return item
    }
    async remove(tenant: Tenant, collection: Collection, id: string) {
        const model = collection === 'reservations' ? ReservationModel : MessageModel
        const item = await model.findOneAndDelete(this.filter(tenant, id))
        if (!item) throw new ApiError(404, 'Item not found')
        return { deleted: true }
    }
    async book(tenant: Tenant, body: Record<string, unknown>) {
        return ReservationModel.create({ ...reservation(body), whitelabelId: tenant._id })
    }
    async message(tenant: Tenant, body: Record<string, unknown>) {
        const values = { ...contact(body), message: text(body.message, 'message', 10000) }
        text(values.email, 'email', 254)
        const saved = await MessageModel.create({ ...values, whitelabelId: tenant._id })
        return { id: saved._id }
    }
    private filter(tenant: Tenant, id: string) {
        if (!isValidObjectId(id)) throw new BadRequestError('Invalid ID')
        return { _id: id, whitelabelId: tenant._id }
    }
}
