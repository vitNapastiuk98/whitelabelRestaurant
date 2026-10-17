import { Component, signal } from '@angular/core';
import {ModalBase} from '../modal.base';
import { FormField, form } from '@angular/forms/signals';
import {HomePageItem} from '../../../domain/content.model';
import {FileUploadComponent} from '../../../../../shared/ui/file-upload/file-upload.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-home-modal',
  imports: [
    FormField,
    FileUploadComponent,
    MatDialogTitle,
    MatDialogClose,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    MatFormField,
    MatInput,
    MatLabel,

  ],
  templateUrl: './edit-home-modal.component.html',
  styleUrl: './edit-home-modal.component.scss'
})
export class EditHomeModalComponent extends ModalBase<{ items: HomePageItem[] }, HomePageItem[]> {
  readonly model = signal({ items: (this.data?.items || []).map(item => ({
    file: typeof item.file === 'string' ? item.file : null,
    text1: item.text1,
    text2: item.text2,
  })) });
  readonly form = form(this.model);

  addItem(): void {
    this.model.update(value => ({ items: [...value.items, { file: null, text1: '', text2: '' }] }));
  }

  removeItem(index: number): void {
    this.model.update(value => ({ items: value.items.filter((_, i) => i !== index) }));
  }

  onConfirm(): void {
    this.dialogRef.close(this.model().items.map(({ file, text1, text2 }) => ({ file, text1, text2 })));
  }
}
