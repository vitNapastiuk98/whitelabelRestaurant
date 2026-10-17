import {WhitelabelService} from '../../../whitelabel/data-access/whitelabel.service';
import {Component, inject, signal} from '@angular/core';
import {EditEventsModalComponent} from '../../ui/editors/edit-events-modal/edit-events-modal.component';
import {EditMenuModalComponent} from '../../ui/editors/edit-menu-modal/edit-menu-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {EditSpecialtiesModalComponent} from '../../ui/editors/edit-specialties-modal/edit-specialties-modal.component';
import {EditAboutModalComponent} from '../../ui/editors/edit-about-modal/edit-about-modal.component';
import {EditHomeModalComponent} from '../../ui/editors/edit-home-modal/edit-home-modal.component';
import { Type } from '@angular/core';
import { RestaurantContent } from '../../domain/content.model';
import { ModalBase } from '../../ui/editors/modal.base';

type AdminContentItem = { label: string; editModal: Type<ModalBase>; viewComponent: Type<unknown> };
import {LandingComponent} from '../landing/landing.component';
import {EventsComponent} from '../events/events.component';
import {AboutComponent} from '../about/about.component';
import {SpecialtiesComponent} from '../specialties/specialties.component';
import {MenuComponent} from '../menu/menu.component';
import {NgComponentOutlet} from '@angular/common';

@Component({
  selector: 'app-content',
  imports: [
    NgComponentOutlet
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {
  // Define your content items as an array of label + component pairs.
  contentItems = signal<AdminContentItem[]>([
    {label: 'Home', editModal: EditHomeModalComponent, viewComponent: LandingComponent},
    { label: 'About',       editModal: EditAboutModalComponent, viewComponent: AboutComponent },
    { label: 'Menu',        editModal: EditMenuModalComponent,viewComponent: MenuComponent },
    { label: 'Specialties', editModal: EditSpecialtiesModalComponent, viewComponent: SpecialtiesComponent },
    { label: 'Events',      editModal: EditEventsModalComponent,viewComponent: EventsComponent },
  ]);
  dialog = inject(MatDialog);
  selectedIndex = signal(0);
  get selectedContent() { return this.contentItems()[this.selectedIndex()]; }
  labels: Record<string, string> = { Home: 'Home', About: 'Su di noi', Menu: 'Menù', Specialties: 'Specialità', Events: 'Eventi' };

  private store = inject(WhitelabelService);
  private sections: Record<string, keyof RestaurantContent> = { Home: 'home', About: 'about', Menu: 'menu', Specialties: 'specialties', Events: 'events' };
  private drafts: Partial<RestaurantContent> = {};
  saving = signal(false);
  status = signal('');
  error = signal('');
  openEditModal(item: AdminContentItem): void {
    if (this.saving()) return;
    const section = this.sections[item.label];
    const defaults: RestaurantContent = { home: { items: [] }, about: { title: '', caption: '', content: '', tag1: '', tag2: '', image: null }, menu: { title: 'Menù', description: '', categories: [] },
      events: { title: 'Eventi', subtitle: '', events: [] }, specialties: { specialties: [] } };
    this.dialog.open(item.editModal, { width: '1000px', maxWidth: 'calc(100vw - 32px)', disableClose: true,
      data: structuredClone(this.drafts[section] || this.store.config()?.content?.[section] || defaults[section])
    }).afterClosed().subscribe(result => {
      if (!result || result === true) return;
      const data = section === 'home' ? { items: result } : result;
      this.drafts[section] = data;
      this.saving.set(true); this.status.set(''); this.error.set('');
      this.store.saveSection(section, data).subscribe({
        next: () => { delete this.drafts[section]; this.saving.set(false); this.status.set('Contenuto salvato.'); },
        error: err => { this.saving.set(false); this.error.set((err.error?.message || 'Salvataggio non riuscito.') + ' Riapri la sezione per riprovare: le modifiche sono conservate.'); }
      });
    });
  }
}
