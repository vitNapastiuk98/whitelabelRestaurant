import { Component, signal } from '@angular/core';
import {ModalBase} from '../modal.base';
import {EventsData} from '../../../domain/content.model';
import { FormField, form } from '@angular/forms/signals';
import {FileUploadComponent} from '../../../../../shared/ui/file-upload/file-upload.component';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-events-modal',
  imports: [
    FormField,
    FileUploadComponent,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogActions
  ],
  templateUrl: './edit-events-modal.component.html',
  styleUrl: './edit-events-modal.component.scss'
})
export class EditEventsModalComponent extends ModalBase<EventsData> {
  readonly model = signal({
    title: this.data?.title || '',
    subtitle: this.data?.subtitle || '',
    events: (this.data?.events || []).map(item => ({
      photo: typeof item.photo === 'string' ? item.photo : null,
      title: item.title,
      description: item.description,
      date: item.date,
    })),
  });
  readonly form = form(this.model);

  addEvent(): void {
    this.model.update(value => ({ ...value, events: [...value.events, { photo: null, title: '', description: '', date: '' }] }));
  }

  removeEvent(index: number): void {
    this.model.update(value => ({ ...value, events: value.events.filter((_, i) => i !== index) }));
  }

  save(): void {
    const { title, subtitle, events } = this.model();
    this.emitData({ title, subtitle, events: events.map(({ photo, title, description, date }) => ({ photo, title, description, date })) });
  }
}
