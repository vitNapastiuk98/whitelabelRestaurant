import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {WhitelabelConfig} from "./WhitelabelConfig";

export class MenuCategory {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public description!: string

    @prop({ required: true, ref: () => WhitelabelConfig }) // Add whitelabelId
    public whitelabelId!: Ref<WhitelabelConfig>
}

export const MenuCategoryModel: any = getModelForClass(MenuCategory)