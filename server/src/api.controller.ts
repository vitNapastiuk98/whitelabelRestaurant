import { All, Controller, Inject, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiService } from './api.service'

@Controller('api')
export class ApiController {
    constructor(@Inject(ApiService) private readonly service: ApiService) {}

    @All(['', ':resource', ':resource/:id'])
    async handle(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
        const result = await this.service.handle(request)
        reply.header('Cache-Control', 'no-store').code(result.status).send(result.body)
    }
}
