import {Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-bar">
      <ul class="nav-list">
        @for (nav of navigationList(); track nav.path) {
          <li><a [routerLink]="nav.path" routerLinkActive="active">{{ nav.name }}</a></li>
        }
      </ul>

    </nav>
  `,
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  navigationList = input<readonly { name: string; path: string }[]>([]);
}
