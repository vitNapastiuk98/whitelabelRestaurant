import { Controller, Post, Body, Res } from 'routing-controllers'
import { AuthService } from '../services/AuthService'
import {User, UserModel} from '../models/User'
import { Response } from 'express'

@Controller('/auth')
export class AuthController {
    private authService = new AuthService()

    @Post('/login')
    async login(
        @Body() body: { username: string; password: string },
        @Res() res: Response
    ) {
        const { username, password } = body
        const token = await this.authService.login(username, password)
        const user = await (UserModel as any).findOne({ username })

        // Set whitelabelId in cookie
        res.cookie('whitelabelId', user?.whitelabelId, { httpOnly: true })
        return { token }
    }
}