import { Module } from '@nestjs/common'
import { AuthController, AdminsController } from './identity.controller'
import { IdentityService } from './identity.service'

@Module({ controllers: [AuthController, AdminsController], providers: [IdentityService] })
export class IdentityModule {}
