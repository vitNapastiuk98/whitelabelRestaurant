import { CanActivate, createParamDecorator, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { authorize, getTenant } from '../lib/auth'
import { connectDB } from '../lib/db'

export type Tenant = NonNullable<Awaited<ReturnType<typeof getTenant>>>
type TenantRequest = FastifyRequest & { tenant: Tenant }

@Injectable()
export class TenantGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        await connectDB()
        const request = context.switchToHttp().getRequest<TenantRequest>()
        request.tenant = await getTenant(request)
        return true
    }
}

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<TenantRequest>()
        await authorize(request, request.tenant)
        return true
    }
}

export const CurrentTenant = createParamDecorator((_data: unknown, context: ExecutionContext): Tenant =>
    context.switchToHttp().getRequest<TenantRequest>().tenant)
