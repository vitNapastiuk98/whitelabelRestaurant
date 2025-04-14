import {Component, OnInit} from '@angular/core';
import {ModalBase} from '../modal.base';
import {AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HomePageItem} from '../../../../core/types/types';
import {FileUploadCvaComponent} from '../../../shared/file-upload-cva/file-upload-cva.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-home-modal',
  imports: [
    ReactiveFormsModule,
    FileUploadCvaComponent,
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
export class EditHomeModalComponent extends ModalBase implements OnInit {

  // Build a form array of items
  form = new FormGroup({
    items: new FormArray<FormGroup>([])
  });

  ngOnInit() {
    // Initialize form array from the data passed in
    this.data?.items?.forEach((item: any) => {
      this.items.push(this.createItemForm(item));
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  // Creates a FormGroup for a single item
  createItemForm(item: HomePageItem
  ): FormGroup {
    return new FormGroup({
      file: new FormControl<File | null>(item.file),
      text1: new FormControl(item.text1, { nonNullable: true }),
      text2: new FormControl(item.text2, { nonNullable: true })
    });
  }

  // Add a new blank item if needed
  addItem(): void {
    const newItem: HomePageItem
      = { file: null, text1: '', text2: '' };
    this.items.push(this.createItemForm(newItem));
  }

  // Remove an item by index
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // Called when user clicks the "X" on the top
  closeModal(): void {
    this.dialogRef.close();
  }

  // Called when user clicks "Cancel"
  onCancel(): void {
    this.dialogRef.close();
  }

  // Called when user clicks "Confirm"
  onConfirm(): void {
    // Gather form data
    const updatedItems = this.form.value.items as HomePageItem[];
    // Send the updated list back to the caller
    this.dialogRef.close(updatedItems);
  }

}
