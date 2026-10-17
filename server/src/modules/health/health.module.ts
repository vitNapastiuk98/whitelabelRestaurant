import { Controller, Get, Module, ServiceUnavailableException } from '@nestjs/common'
import mongoose from 'mongoose'

@Controller('api/health')
class HealthController {
    @Get()
    async check() {
        if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) throw new ServiceUnavailableException('Database unavailable')
        try { await mongoose.connection.db.admin().ping() }
        catch { throw new ServiceUnavailableException('Database unavailable') }
        return { status: 'ok' }
    }
}

@Module({ controllers: [HealthController] })
export class HealthModule {}
