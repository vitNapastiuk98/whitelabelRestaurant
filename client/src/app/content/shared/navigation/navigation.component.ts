import {Component, input, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navigation',
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="nav-bar">
      <ul class="nav-list">
        @for (nav of navigationList(); track nav.path) {
          <li><a [routerLink]="nav.path">{{ nav.name }}</a></li>
        }
      </ul>

    </nav>
  `,
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  navigationList = input<any[]>([]);
}
