import {RouterLink} from '@angular/router';
import { Component, computed, inject } from '@angular/core';
import { WhitelabelService } from '../../../whitelabel/data-access/whitelabel.service';
@Component({ selector: 'app-about', imports: [RouterLink], templateUrl: './about.component.html', styleUrl: './about.component.scss' })
export class AboutComponent {
  private store = inject(WhitelabelService);
  data = computed(() => this.store.config()?.content?.['about']);
  splitTag(tag: string | undefined) {
    const match = (tag || '').match(/^(\d+\+?)\s*(.*)$/);
    return match ? { value: match[1], label: match[2] } : { value: '', label: tag || '' };
  }
}
