import 'reflect-metadata'
import { Module, Catch, NotFoundException, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyStatic from '@fastify/static'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { ApiController } from './api.controller'
import { ApiService } from './api.service'

@Module({ controllers: [ApiController], providers: [ApiService] })
class AppModule {}

@Catch(NotFoundException)
class ClientFallback implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const request = context.getRequest()
        const reply = context.getResponse()
        if (request.url.startsWith('/api')) return reply.code(404).send({ message: 'API route not found' })
        if (!['GET', 'HEAD'].includes(request.method)) return reply.code(405).send({ message: 'Method not allowed' })
        const index = path.resolve(__dirname, '../public/index.html')
        if (existsSync(index)) return reply.code(200).header('Cache-Control', 'no-cache').sendFile('index.html')
        return reply.code(503).send({ message: 'Build the Angular client first with npm run build from the repository root' })
    }
}

export async function createApp() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule,
        new FastifyAdapter({ bodyLimit: 16 * 1024 * 1024 }), { logger: ['error', 'warn'] })
    const client = path.resolve(__dirname, '../public')
    if (existsSync(path.join(client, 'index.html'))) {
        await app.register(fastifyStatic, { root: client, wildcard: false })
    }
    app.useGlobalFilters(new ClientFallback())
    return app
}
