import { Component } from '@angular/core';
import {ModalBase} from '../modal.base';
import {EventItem, EventsData} from '../../../../core/types/types';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FileUploadCvaComponent} from '../../../shared/file-upload-cva/file-upload-cva.component';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-events-modal',
  imports: [
    ReactiveFormsModule,
    FileUploadCvaComponent,
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
export class EditEventsModalComponent extends ModalBase {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();

    const initData = this.data || {
      title: '',
      subtitle: '',
      events: [],
    };

    this.form = this.fb.group({
      title: [initData.title],
      subtitle: [initData.subtitle],
      events: this.fb.array(
        initData.events.map((e: any) => this.createEventForm(e))
      ),
    });
  }

  get events(): FormArray {
    return this.form.get('events') as FormArray;
  }

  // Create a form group for a single event item
  createEventForm(item: EventItem): FormGroup {
    return this.fb.group({
      photo: [item.photo], // File or null
      title: [item.title],
      description: [item.description],
      date: [item.date],
    });
  }

  // Add a new event
  addEvent(): void {
    const newItem: EventItem = {
      photo: null,
      title: '',
      description: '',
      date: ''
    };
    this.events.push(this.createEventForm(newItem));
  }

  // Remove an event by index
  removeEvent(index: number): void {
    this.events.removeAt(index);
  }

  // Called when user clicks "Save"
  save(): void {
    // Return the updated data to the caller
    this.emitData(this.form.value as EventsData);
  }
}
