import { Component, input, output } from '@angular/core';
import { MenuItem } from '../../../domain/content.model';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent {
  readonly item = input.required<MenuItem>();
  readonly itemSelected = output<MenuItem>();
  onSelectItem() { this.itemSelected.emit(this.item()); }
}
