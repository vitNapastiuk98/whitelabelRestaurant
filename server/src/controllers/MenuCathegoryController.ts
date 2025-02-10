import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    CookieParam,
    Authorized
} from 'routing-controllers'
import { MenuCategoryService } from '../services/MenuCategoryService'
import { MenuCategory } from '../models/MenuCategory'

@Controller('/menu-categories')
export class MenuCategoryController {
    private menuCategoryService = new MenuCategoryService()

    // --- Guest Routes (Public) ---

    /**
     * Retrieve all menu categories for the whitelabel specified in the cookie.
     * Accessible by any client (guest site).
     */
    @Get()
    async getMenuCategories(@CookieParam('whitelabelId') whitelabelId: string) {
        return this.menuCategoryService.getMenuCategories(whitelabelId)
    }

    /**
     * Retrieve a specific menu category by id for the current whitelabel.
     * Accessible by any client (guest site).
     */
    @Get('/:id')
    async getMenuCategory(
        @Param('id') id: string,
        @CookieParam('whitelabelId') whitelabelId: string
    ) {
        return this.menuCategoryService.getMenuCategory(id, whitelabelId)
    }


    /**
     * Create a new menu category.
     * Only registered (admin) users can access this endpoint.
     */
    @Post()
    @Authorized() // Your auth middleware will ensure the user is registered (admin)
    async addMenuCategory(
        @Body() menuCategory: MenuCategory,
        @CookieParam('whitelabelId') whitelabelId: string
    ) {
        // Enforce the whitelabel context from the cookie.
        menuCategory.whitelabelId = whitelabelId as any
        return this.menuCategoryService.addMenuCategory(menuCategory)
    }

    /**
     * Update an existing menu category.
     * Only registered (admin) users can access this endpoint.
     */
    @Put('/:id')
    @Authorized() // Only admins can update
    async updateMenuCategory(
        @Param('id') id: string,
        @Body() menuCategory: Partial<MenuCategory>,
        @CookieParam('whitelabelId') whitelabelId: string
    ) {
        // Ensure the update is for the correct whitelabel.
        menuCategory.whitelabelId = whitelabelId as any
        return this.menuCategoryService.updateMenuCategory(id, menuCategory)
    }

    /**
     * Delete a menu category.
     * Only registered (admin) users can delete a category.
     */
    @Delete('/:id')
    @Authorized() // Only admins can delete
    async deleteMenuCategory(
        @Param('id') id: string,
        @CookieParam('whitelabelId') whitelabelId: string
    ) {
        // Confirm that the category belongs to the whitelabel before deleting.
        const category = await this.menuCategoryService.getMenuCategory(id, whitelabelId)
        if (!category) {
            return { message: 'Category not found or does not belong to this whitelabel.' }
        }
        return this.menuCategoryService.deleteMenuCategory(id)
    }
}
