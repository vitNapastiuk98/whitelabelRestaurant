import { Component, signal } from '@angular/core';
import {ModalBase} from '../modal.base';
import { FormField, form } from '@angular/forms/signals';
import {AboutSectionData} from '../../../domain/content.model';
import {FileUploadComponent} from '../../../../../shared/ui/file-upload/file-upload.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-about-modal',
  imports: [
    FormField,
    FileUploadComponent,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogActions,
    MatFormField,
    MatLabel,
    MatInput
  ],
  templateUrl: './edit-about-modal.component.html',
  styleUrl: './edit-about-modal.component.scss'
})
export class EditAboutModalComponent extends ModalBase<AboutSectionData> {
  readonly model = signal({
    title: this.data?.title || '',
    tag1: this.data?.tag1 || '',
    caption: this.data?.caption || '',
    content: this.data?.content || '',
    tag2: this.data?.tag2 || '',
    image: typeof this.data?.image === 'string' ? this.data.image : null,
  });
  readonly form = form(this.model);

  save(): void {
    this.emitData(this.model());
  }
}
