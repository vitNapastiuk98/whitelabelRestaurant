import { prop, getModelForClass, pre } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'

@pre<WhitelabelConfig>('save', function () {
    if ((this as WhitelabelConfig).enabledFeatures.theFork) {
        if (!(this as WhitelabelConfig).theForkId || !(this as WhitelabelConfig).theForkKey) {
            throw new Error('theForkId and theForkKey are required when theFork feature is enabled')
        }
    }
})
export class WhitelabelConfig {
    @prop({ required: true, unique: true })
    public domain!: string

    @prop({ required: true })
    public theme!: string

    @prop()
    public logo?: string

    @prop({ type: Object, required: true })
    public enabledFeatures!: {
        menu: boolean
        events: boolean
        reservations: boolean
        theFork: boolean
    }

    @prop()
    public theForkId?: string

    @prop()
    public theForkKey?: string
}

export const WhitelabelConfigModel: any = getModelForClass(WhitelabelConfig)