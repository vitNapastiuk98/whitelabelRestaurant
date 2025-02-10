import { MenuCategory, MenuCategoryModel } from '../models/MenuCategory'

export class MenuCategoryService {
    /**
     * Retrieve all menu categories for a given whitelabel.
     * @param whitelabelId The identifier from the cookie.
     */
    public async getMenuCategories(whitelabelId: string) {
        return MenuCategoryModel.find({ whitelabelId })
    }

    /**
     * Retrieve a single menu category by its id and whitelabel.
     * @param id The ID of the menu category.
     * @param whitelabelId The identifier from the cookie.
     */
    public async getMenuCategory(id: string, whitelabelId: string) {
        return MenuCategoryModel.findOne({ _id: id, whitelabelId })
    }

    /**
     * Create a new menu category.
     * @param menuCategoryData The data for the new menu category.
     */
    public async addMenuCategory(menuCategoryData: Partial<MenuCategory>) {
        const menuCategory = new MenuCategoryModel(menuCategoryData)
        return menuCategory.save()
    }

    /**
     * Update an existing menu category.
     * @param id The ID of the menu category.
     * @param menuCategoryData The updated data.
     */
    public async updateMenuCategory(id: string, menuCategoryData: Partial<MenuCategory>) {
        return MenuCategoryModel.findByIdAndUpdate(id, menuCategoryData, { new: true })
    }

    /**
     * Delete a menu category.
     * @param id The ID of the menu category.
     */
    public async deleteMenuCategory(id: string) {
        return MenuCategoryModel.findByIdAndDelete(id)
    }
}
