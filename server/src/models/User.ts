import { prop, getModelForClass, Ref, pre, modelOptions } from '@typegoose/typegoose'
import { WhitelabelConfig } from './WhitelabelConfig'
import bcrypt from 'bcryptjs'

@pre<User>('save', async function() {
    if ((this as any).isModified('password')) {
        (this as User).password = await bcrypt.hash((this as User).password, 10)
    }
})
@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                delete ret.password
                return ret
            }
        }
    }
})
export class User {
    @prop({ required: true, unique: true })
    public username!: string

    @prop({ required: true })
    public password!: string

    @prop({ required: true, ref: () => WhitelabelConfig })
    public whitelabelId!: Ref<WhitelabelConfig>

    // Compare entered password with stored hash
    public async comparePassword(enteredPassword: string): Promise<boolean> {
        return bcrypt.compare(enteredPassword, this.password)
    }

    // Manual password hashing method (alternative to pre-save hook)
    public async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, 10)
    }
}

export const UserModel: any = getModelForClass(User)