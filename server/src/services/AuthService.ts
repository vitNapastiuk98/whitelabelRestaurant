import jwt from 'jsonwebtoken'
import { UserModel, User } from '../models/User'
import { JWT_SECRET } from '../config/auth'

export class AuthService {
    async login(username: string, password: string) {
        const user = await (UserModel as any).findOne({ username })
        if (!user) throw new Error('User not found')

        const isMatch = await user.comparePassword(password)
        if (!isMatch) throw new Error('Invalid credentials')

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' })
        return token
    }

    async verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET) as { userId: string }
    }
}