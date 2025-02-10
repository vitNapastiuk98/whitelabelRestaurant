import { MenuItemModel, MenuItem } from '../models/MenuItem'

export class MenuService {
    async getMenuItems(whitelabelId: string): Promise<MenuItem[]> {
        return (MenuItemModel as any).find({ whitelabelId })
    }

    async addMenuItem(item: MenuItem) {
        const newItem = new MenuItemModel(item)
        return newItem.save()
    }

    async removeMenuItem(id: string, whitelabelId: string) {
        return (MenuItemModel as any).findOneAndDelete({ _id: id, whitelabelId })
    }
}
