import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {WhitelabelConfig} from "./WhitelabelConfig";
import {MenuCategory} from "./MenuCategory";
import {FileDocument} from "./FileDocument";

export class MenuItem {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public description!: string

    @prop({required: true, ref: () => FileDocument})
    public photo!: Ref<FileDocument>

    @prop({ required: true })
    public price!: number

    @prop({ required: true })
    public category!: Ref<MenuCategory>

    @prop({ required: true, ref: () => WhitelabelConfig }) // Add whitelabelId
    public whitelabelId!: Ref<WhitelabelConfig>
}

export const MenuItemModel: any = getModelForClass(MenuItem)