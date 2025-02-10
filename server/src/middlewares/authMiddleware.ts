import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/auth'
import {CustomReq} from "../types/custom.http";

export const authMiddleware = (req: CustomReq, res: Response, next: NextFunction) => {
    try {
    const token = req.header('Authorization')!.replace('Bearer ', '')
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' })
    }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        req.userId = decoded.userId
        next()
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' })
    }
}