import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-menu-category',
  templateUrl: './menu-category.component.html',
  styleUrls: ['./menu-category.component.scss'],
  standalone: true,
})
export class MenuCategoryComponent {
  name = input<string>();       // Category name
  isActive = input<boolean>(false);    // Indicates if this category is selected
  categorySelected = output();

  onCategoryClick(): void {
    this.categorySelected.emit();
  }
}
