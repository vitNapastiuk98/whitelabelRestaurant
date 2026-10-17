import mongoose, { Schema } from 'mongoose'

const tenant = { type: Schema.Types.ObjectId, ref: 'WhitelabelConfig', required: true, index: true }
const config = new Schema({
    domain: { type: String, required: true, unique: true },
    domains: { type: [String], default: undefined },
    colors: { type: Schema.Types.Mixed, default: () => ({ primary: '#344e41', background: '#edede9', text: '#171a17', button: '#000000' }) },
    name: { type: String, default: 'Er Spaghetto' },
    theme: { type: String, default: 'default-theme' },
    logo: String,
    enabledFeatures: { type: Schema.Types.Mixed, default: { menu: true, events: true, reservations: true, theFork: false } },
    // shortcut: images share MongoDB's 16 MB document limit; use object storage when content grows beyond it.
    content: { type: Schema.Types.Mixed, default: {} },
    contactInfo: { type: Schema.Types.Mixed, default: {} },
    theForkId: String,
    theForkKey: { type: String, select: false },
})
// One unique multikey index covers primary domains and aliases, including simultaneous claims.
config.index({ domains: 1 }, { unique: true, sparse: true })
config.pre('validate', function () {
    if (this.isNew || this.isModified('domain') || this.isModified('domains')) {
        this.domains = [...new Set([this.domain.toLowerCase().replace(/\.$/, ''), ...(this.domains || [])])]
    }
})
export const WhitelabelConfigModel = mongoose.models.WhitelabelConfig || mongoose.model('WhitelabelConfig', config)
export const UserModel = mongoose.models.User || mongoose.model('User', new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    whitelabelId: tenant,
}, { timestamps: true }))
export const ReservationModel = mongoose.models.Reservation || mongoose.model('Reservation', new Schema({
    name: { type: String, required: true, maxlength: 120 },
    phone: { type: String, required: true, maxlength: 40 },
    email: { type: String, default: '', maxlength: 254 },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 50 },
    whitelabelId: tenant,
}))
export const MessageModel = mongoose.models.Message || mongoose.model('Message', new Schema({
    name: { type: String, required: true, maxlength: 120 },
    phone: { type: String, required: true, maxlength: 40 },
    email: { type: String, required: true, maxlength: 254 },
    message: { type: String, required: true, maxlength: 10000 },
    whitelabelId: tenant,
}, { timestamps: true }))
export const MenuCategoryModel = mongoose.models.MenuCategory || mongoose.model('MenuCategory', new Schema({
    name: { type: String, required: true }, description: { type: String, default: '' }, whitelabelId: tenant,
}))
export const MenuItemModel = mongoose.models.MenuItem || mongoose.model('MenuItem', new Schema({
    name: { type: String, required: true }, description: String, photo: String, allergens: String,
    price: { type: Number, required: true, min: 0 }, category: { type: Schema.Types.ObjectId, ref: 'MenuCategory' },
    whitelabelId: tenant,
}))
export const EventModel = mongoose.models.Event || mongoose.model('Event', new Schema({
    title: { type: String, required: true }, description: String, date: { type: Date, required: true },
    image: String, whitelabelId: tenant,
}))
export const FileDocumentModel = mongoose.models.FileDocument || mongoose.model('FileDocument', new Schema({
    name: String, path: String, type: String, whitelabelId: tenant,
}))

const connection = globalThis as typeof globalThis & { restaurantDB?: Promise<typeof mongoose> }
export async function migrateDomains() {
    for (const config of await WhitelabelConfigModel.find().select('domain domains').lean()) {
        await WhitelabelConfigModel.updateOne({ _id: config._id }, { $addToSet: { domains: config.domain.toLowerCase().replace(/\.$/, '') } })
    }
}
export async function connectDB() {
    if (!connection.restaurantDB) {
        connection.restaurantDB = mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant')
            .then(async connection => {
                await Promise.all([WhitelabelConfigModel.init(), UserModel.init()])
                await migrateDomains()
                return connection
            })
            .catch(error => { connection.restaurantDB = undefined; throw error })
    }
    return connection.restaurantDB
}
