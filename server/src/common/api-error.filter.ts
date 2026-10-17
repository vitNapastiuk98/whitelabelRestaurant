import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { ApiError } from '../lib/errors'

@Catch()
export class ApiErrorFilter implements ExceptionFilter {
    catch(error: any, host: ArgumentsHost) {
        const status = error.code === 11000 ? 409 : error instanceof ApiError ? error.status
            : error instanceof HttpException ? error.getStatus()
            : ['ValidationError', 'CastError'].includes(error.name) ? 400 : 500
        if (status === 500) console.error(error)
        const message = status === 409 ? 'Username or domain already in use'
            : status === 500 ? 'An unexpected error occurred'
            : status === 404 && error instanceof HttpException ? 'API route not found' : error.message
        host.switchToHttp().getResponse().header('Cache-Control', 'no-store').code(status).send({ message })
    }
}
