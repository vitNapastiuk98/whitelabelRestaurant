import 'dotenv/config'
import { createApp } from './app'
import { connectDB } from './lib/db'

async function start() {
    await connectDB()
    const app = await createApp()
    app.enableShutdownHooks()
    const port = Number(process.env.PORT || 3000)
    await app.listen(port, process.env.HOST || '127.0.0.1')
    console.log(`Restaurant running at http://localhost:${port}`)
}
start().catch(error => { console.error(error.message); process.exit(1) })
