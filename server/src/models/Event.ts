import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {WhitelabelConfig} from "./WhitelabelConfig";
import {FileDocument} from "./FileDocument";

export class Event {
    @prop({ required: true })
    public title!: string

    @prop({ required: true })
    public description!: string

    @prop({ required: true })
    public date!: Date

    @prop({required: true, ref: () => FileDocument})
    public image?: Ref<FileDocument>

    @prop({ required: true, ref: () => WhitelabelConfig }) // Add whitelabelId
    public whitelabelId!: Ref<WhitelabelConfig>
}

export const EventModel = getModelForClass(Event)