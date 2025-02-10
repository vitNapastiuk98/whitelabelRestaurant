import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/restaurant', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any)
        console.log('MongoDB connected')
    } catch (err) {
        console.error('MongoDB connection error:', err)
        process.exit(1)
    }
}

export default connectDB