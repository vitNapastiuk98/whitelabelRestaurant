import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhitelabelService } from '../../../whitelabel/data-access/whitelabel.service';
@Component({ selector: 'app-specialties', templateUrl: './specialties.component.html', styleUrls: ['./specialties.component.scss'], imports: [RouterLink] })
export class SpecialtiesComponent {
  private store = inject(WhitelabelService);
  dishes = computed(() => this.store.config()?.content?.['specialties']?.specialties || []);
  priceFor(name: string): number | undefined {
    return (this.store.config()?.content?.['menu']?.categories || []).flatMap((category) => category.items)
      .find((item) => item.name.toLocaleLowerCase('it') === name.toLocaleLowerCase('it'))?.price;
  }
}
