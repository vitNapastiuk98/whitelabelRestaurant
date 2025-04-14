import { Component } from '@angular/core';
import {ModalBase} from '../modal.base';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AboutSectionData} from '../../../../core/types/types';
import {FileUploadCvaComponent} from '../../../shared/file-upload-cva/file-upload-cva.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-about-modal',
  imports: [
    ReactiveFormsModule,
    FileUploadCvaComponent,
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
export class EditAboutModalComponent extends ModalBase {
  form = new FormGroup({
    title: new FormControl(this.data?.title || ''),
    tag1: new FormControl(this.data?.tag1 || ''),
    caption: new FormControl(this.data?.caption || ''),
    content: new FormControl(this.data?.content || ''),
    tag2: new FormControl(this.data?.tag2 || ''),
    image: new FormControl<File | null>(this.data?.image || null),
  });

  // Called when user clicks "Save" in the template
  save(): void {
    // Emit the updated form data to the parent
    this.emitData(this.form.value as AboutSectionData);
  }
}
