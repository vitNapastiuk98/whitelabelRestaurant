import { Component, computed, inject } from '@angular/core';
import { WhitelabelService } from '../../../whitelabel/data-access/whitelabel.service';
@Component({ selector: 'app-events', templateUrl: './events.component.html', styleUrls: ['./events.component.scss'] })
export class EventsComponent {
  private store = inject(WhitelabelService);
  data = computed(() => this.store.config()?.content?.['events']);
  events = computed(() => this.data()?.events || []);
}
