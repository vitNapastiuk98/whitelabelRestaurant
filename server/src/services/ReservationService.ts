import { ReservationModel, Reservation } from '../models/Reservation'
import { UserModel } from '../models/User'

export class ReservationService {
    async getReservations() {
        return (ReservationModel as any).find().populate('user')
    }

    async addReservation(reservation: Reservation) {

        const newReservation = new ReservationModel(reservation)
        return newReservation.save()
    }

    async removeReservation(id: string) {
        return (ReservationModel as any).findByIdAndDelete(id)
    }
}
