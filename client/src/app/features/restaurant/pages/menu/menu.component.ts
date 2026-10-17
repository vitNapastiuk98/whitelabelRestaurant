import {WhitelabelService} from '../../../whitelabel/data-access/whitelabel.service';
import { Component, signal, computed, inject } from '@angular/core';
import {MenuCategoryComponent} from './menu-category/menu-category.component';
import {MenuItemComponent} from './menu-item/menu-item.component';

import { MenuCategory, MenuItem } from '../../domain/content.model';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    MenuCategoryComponent,
    MenuItemComponent
  ]
})
export class MenuComponent {
  private store = inject(WhitelabelService);
  data = computed(() => this.store.config()?.content?.['menu']);
  categories = computed<MenuCategory[]>(() => this.data()?.categories || []);
  selectedCategoryIndex = signal<number>(0);
  selectedItem = signal<MenuItem | undefined>(undefined);

  get selectedCategory() {
    return this.categories()[this.selectedCategoryIndex()];
  }


  get detailItem() { return this.selectedItem() || this.selectedCategory?.items[0]; }

  selectCategory(index: number): void {
    this.selectedCategoryIndex.set(index);
    this.selectedItem.set(undefined);
  }

  selectItem(item: MenuItem): void {
    this.selectedItem.set(item);
  }
}
