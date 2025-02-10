// src/middlewares/whitelabelMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import { WhitelabelConfigModel } from '../models/WhitelabelConfig'

export async function whitelabelMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Extract subdomain or path segment
        const domain = req.headers.host || 'localhost'

        // Find matching whitelabel config
        const config = await (WhitelabelConfigModel as any).findOne({ domain })

        if (config) {
            // Set whitelabel ID in cookie
            res.cookie('whitelabelId', config._id.toString(), {
                maxAge: 86400000, // 24 hours
                httpOnly: true
            })
        }

        next()
    } catch (error) {
        next(error)
    }
}