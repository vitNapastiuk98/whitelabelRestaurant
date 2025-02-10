import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {WhitelabelConfig} from "./WhitelabelConfig";

export class FileDocument {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public path!: string

    @prop({ required: true })
    public type!: string

    @prop({ required: true, ref: () => WhitelabelConfig }) // Add whitelabelId
    public whitelabelId!: Ref<WhitelabelConfig>
}

export const MenuItemModel = getModelForClass(FileDocument)