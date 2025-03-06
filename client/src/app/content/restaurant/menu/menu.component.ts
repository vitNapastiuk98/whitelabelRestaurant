import { Component, OnInit, signal } from '@angular/core';
import {MenuCategoryComponent} from './menu-category/menu-category.component';
import {MenuItemComponent} from './menu-item/menu-item.component';

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  allergens?: string;
  photo?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

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
export class MenuComponent implements OnInit {
  categories = signal<MenuCategory[]>([]);
  selectedCategoryIndex = signal<number>(0);
  selectedItem = signal<MenuItem | undefined>(undefined);

  get selectedCategory() {
    return this.categories()[this.selectedCategoryIndex()];
  }

  ngOnInit(): void {
    // Example data
    this.categories.set([
      {
        name: 'Antipasti',
        items: [
          {
            name: 'Bruschetta al Pomodoro & Basilico',
            price: 12.9,
            description: 'Pane tostato con pomodoro fresco, basilico e olio extravergine.',
            allergens: 'Glutine',
            photo: '/bruschette.png',
          },
          {
            name: 'Carpaccio di Manzo',
            price: 14.9,
            description: 'Manzo crudo con rucola e parmigiano.',
            allergens: 'Latte',
            photo: '/bruschette.png',

          },
        ],
      },
      {
        name: 'Primi',
        items: [
          { name: 'Spaghetti alla Carbonara', price: 15.5, photo: '/bruschette.png', allergens: 'Uova, Latte, Glutine' },
          { name: 'Lasagne al Forno', price: 14.9, photo: '/bruschette.png', allergens: 'Latte, Glutine' },
        ],
      },
      {
        name: 'Secondi',
        items: [
          { name: 'Pollo alla Cacciatora',  photo: '/bruschette.png', price: 18.0 },
          { name: 'Bistecca alla Fiorentina', price: 28.5 , photo: '/bruschette.png', },
        ],
      },
    ]);
  }

  selectCategory(index: number): void {
    this.selectedCategoryIndex.set(index);
    this.selectedItem.set(undefined);
  }

  selectItem(item: MenuItem): void {
    this.selectedItem.set(item);
  }
}
