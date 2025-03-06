import { Component, Input, Output, EventEmitter, signal, Signal } from '@angular/core';
import {MenuItem} from '../menu.component';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  standalone: true,
})
export class MenuItemComponent {
  @Input({ transform: (value: MenuItem) => signal(value) })
  item!: Signal<MenuItem>;

  @Output() itemSelected = new EventEmitter<MenuItem>();

  onSelectItem(): void {
    // item is a signal, so item() returns the current data
    this.itemSelected.emit(this.item());
  }
}
