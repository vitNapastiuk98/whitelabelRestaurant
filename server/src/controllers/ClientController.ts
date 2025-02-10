import { Controller, Get, Req, Res } from 'routing-controllers'
import { Request, Response } from 'express'
import { WhitelabelConfigModel } from '../models/WhitelabelConfig'
import path from 'path'

@Controller()
export class ClientController {
    /**
     * This catch‑all GET route handles front‑end requests.
     * It checks the request’s domain, finds the associated WhitelabelConfig,
     * sets a cookie with that configuration, and then sends the index.html file.
     */
    @Get('*')
    async renderClient(@Req() req: Request, @Res() res: Response) {
        // Extract the domain. (You may want to adjust this if you use subdomains or ports.)
        const domain = req.hostname || req.headers.host

        try {
            // Look up the whitelabel configuration for the current domain.
            const config = await WhitelabelConfigModel.findOne({ domain })

            if (config) {
                // Set a cookie with the relevant whitelabel configuration.
                // Here we choose to pass a subset of the configuration. You may decide to include more or less.
                res.cookie(
                    'whitelabelInfo',
                    JSON.stringify({
                        domain: config.domain,
                        theme: config.theme,
                        logo: config.logo,
                        enabledFeatures: config.enabledFeatures,
                        // Optionally pass IDs or keys if needed by the front-end (be cautious with sensitive data)
                        // theForkId: config.theForkId,
                    }),
                    {
                        // Set additional cookie options as needed.
                        // For example, httpOnly: false so the client JS can read it.
                        httpOnly: false,
                        // secure: true, // use this in production if serving over HTTPS
                    }
                )
            } else {
                console.warn(`No whitelabel config found for domain: ${domain}`)
            }
        } catch (error) {
            console.error('Error fetching whitelabel config:', error)
        }

        // Resolve the path to your front‑end index.html (adjust the path based on your project structure)
        const clientIndexPath = path.resolve(__dirname, '../../client', 'index.html')

        // Send the index.html file to the client to bootstrap the FE application.
        return res.sendFile(clientIndexPath)
    }
}
