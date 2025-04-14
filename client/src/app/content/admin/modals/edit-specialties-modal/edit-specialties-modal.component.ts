import {Component} from '@angular/core';
import {ModalBase} from '../modal.base';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {SpecialtiesData, Specialty} from '../../../../core/types/types';
import {FileUploadCvaComponent} from '../../../shared/file-upload-cva/file-upload-cva.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-specialties-modal',
  imports: [
    ReactiveFormsModule,
    FileUploadCvaComponent,
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
export class EditSpecialtiesModalComponent extends ModalBase {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    const initData = this.data || {
      specialties: [
        { photo: null, name: '', menuLink: '' },
        { photo: null, name: '', menuLink: '' },
        { photo: null, name: '', menuLink: '' },
      ]
    };

    this.form = this.fb.group({
      specialties: this.fb.array(
        initData.specialties.map((spec: any) => this.createSpecialtyForm(spec))
      )
    });
  }

  get specialtiesArray(): FormArray {
    return this.form.get('specialties') as FormArray;
  }

  createSpecialtyForm(spec: Specialty): FormGroup {
    return this.fb.group({
      photo: new FormControl(spec.photo),
      name: new FormControl(spec.name),
      menuLink: new FormControl(spec.menuLink),
    });
  }

  save(): void {
    if (this.form.valid) {
      this.emitData(this.form.value as SpecialtiesData);
    }
  }
}
