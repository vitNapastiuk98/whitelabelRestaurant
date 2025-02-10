import {Controller, Get, Post, Body, Delete, Param, CookieParam, Authorized} from 'routing-controllers'
import { MenuService } from '../services/MenuService'
import { MenuItem } from '../models/MenuItem'

@Controller('/menu')
export class MenuController {
    private menuService = new MenuService()

    @Get()
    async getMenuItems(@CookieParam('whitelabelId') whitelabelId: string) {
        if (!whitelabelId) throw new Error('Whitelabel ID required')
        return this.menuService.getMenuItems(whitelabelId)
    }

    @Post()
    @Authorized()
    async addMenuItem(
        @Body() item: MenuItem,
        @CookieParam('whitelabelId') whitelabelId: string
    ) {
        if (!whitelabelId) throw new Error('Whitelabel ID required')
        const newItem = { ...item, whitelabelId } as MenuItem
        return this.menuService.addMenuItem(newItem)
    }

    @Delete('/:id')
    @Authorized()
    async removeMenuItem(
        @Param('id') id: string,
        @CookieParam('whitelabelId') whitelabelId: string
    ) {
        if (!whitelabelId) throw new Error('Whitelabel ID required')
        return this.menuService.removeMenuItem(id, whitelabelId)
    }
}