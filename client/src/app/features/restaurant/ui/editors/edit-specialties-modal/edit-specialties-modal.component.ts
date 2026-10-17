import { Component, signal } from '@angular/core';
import {ModalBase} from '../modal.base';
import { FormField, form } from '@angular/forms/signals';
import {SpecialtiesData} from '../../../domain/content.model';
import {FileUploadComponent} from '../../../../../shared/ui/file-upload/file-upload.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-specialties-modal',
  imports: [
    FormField,
    FileUploadComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './edit-specialties-modal.component.html',
  styleUrl: './edit-specialties-modal.component.scss'
})
export class EditSpecialtiesModalComponent extends ModalBase<SpecialtiesData> {
  readonly model = signal({ specialties: (this.data?.specialties || Array.from({ length: 3 }, () => ({
    photo: null, name: '', menuLink: '',
  }))).map(item => ({
    photo: typeof item.photo === 'string' ? item.photo : null,
    name: item.name,
    menuLink: item.menuLink,
  })) });
  readonly form = form(this.model);

  save(): void {
    this.emitData({ specialties: this.model().specialties.map(({ photo, name, menuLink }) => ({ photo, name, menuLink })) });
  }
}
