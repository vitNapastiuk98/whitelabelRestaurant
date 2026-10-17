import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './lib/db'
import { seed } from './lib/seed'

connectDB().then(seed).then(() => console.log('Restaurant data ready'))
    .catch(error => { console.error(error.message); process.exitCode = 1 })
    .finally(() => mongoose.disconnect())
