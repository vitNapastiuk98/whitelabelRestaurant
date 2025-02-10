import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from './User'
import {WhitelabelConfig} from "./WhitelabelConfig";

export class Reservation {


    @prop({ required: true })
    public date!: Date

    @prop({ required: true })
    public time!: string

    @prop({ required: true })
    public guests!: number

    @prop({ required: true, ref: () => WhitelabelConfig }) // Add whitelabelId
    public whitelabelId!: Ref<WhitelabelConfig>
}

export const ReservationModel:any = getModelForClass(Reservation)