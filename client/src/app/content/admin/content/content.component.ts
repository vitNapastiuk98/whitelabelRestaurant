import {Component, inject, signal} from '@angular/core';
import {EditEventsModalComponent} from '../modals/edit-events-modal/edit-events-modal.component';
import {EditMenuModalComponent} from '../modals/edit-menu-modal/edit-menu-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {EditSpecialtiesModalComponent} from '../modals/edit-specialties-modal/edit-specialties-modal.component';
import {EditAboutModalComponent} from '../modals/edit-about-modal/edit-about-modal.component';
import {EditHomeModalComponent} from '../modals/edit-home-modal/edit-home-modal.component';
import {AdminContentItem} from '../../../core/types/types';
import {LandingComponent} from '../../restaurant/landing/landing.component';
import {EventsComponent} from '../../restaurant/events/events.component';
import {AboutComponent} from '../../restaurant/about/about.component';
import {SpecialtiesComponent} from '../../restaurant/specialties/specialties.component';
import {MenuComponent} from '../../restaurant/menu/menu.component';
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

  openEditModal(item: AdminContentItem): void {
    this.dialog.open(item.editModal, {
      width: '80vw',
      disableClose: true,
      data: null // pass any common data here if needed
    });
  }
}
