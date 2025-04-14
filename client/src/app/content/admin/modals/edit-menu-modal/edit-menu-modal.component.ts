import {Component} from '@angular/core';
import {ModalBase} from '../modal.base';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EditMenuData, MenuCategory, MenuItem} from '../../../../core/types/types';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-menu-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './edit-menu-modal.component.html',
  styleUrl: './edit-menu-modal.component.scss'
})
export class EditMenuModalComponent extends ModalBase {
  form: FormGroup;
  selectedCategoryIndex = 0; // which category is currently selected

  constructor(private fb: FormBuilder) {
    super();
    const initialData = this.data || {
      title: '',
      description: '',
      categories: [],
    };

    this.form = this.fb.group({
      title: [initialData.title, [Validators.required]],
      description: [initialData.description],
      categories: this.fb.array(
        initialData.categories?.map((cat: any) => this.createCategoryForm(cat))
      )
    });
  }

  get categories(): FormArray {
    return this.form.get('categories') as FormArray;
  }

  // Return a typed form group for a category
  createCategoryForm(cat: MenuCategory): FormGroup {
    return this.fb.group({
      name: [cat.name, Validators.required],
      items: this.fb.array(
        cat.items.map(item => this.createMenuItemForm(item))
      )
    });
  }

  // Return a typed form group for a menu item
  createMenuItemForm(item: MenuItem): FormGroup {
    return this.fb.group({
      name: [item.name, Validators.required],
      price: [item.price, [Validators.required, Validators.min(0)]]
    });
  }

  // Helper to get the currently selected category form group
  get selectedCategoryGroup(): FormGroup {
    return this.categories.at(this.selectedCategoryIndex) as FormGroup;
  }

  // The items array for the selected category
  get selectedItems(): FormArray {
    return this.selectedCategoryGroup.get('items') as FormArray;
  }

  // Switch the selected category
  selectCategory(index: number): void {
    this.selectedCategoryIndex = index;
  }

  // Optionally add a new item to the selected category
  addItem(): void {
    const newItem: MenuItem = { name: '', price: 0 };
    this.selectedItems.push(this.createMenuItemForm(newItem));
  }

  // Remove an item by index
  removeItem(index: number): void {
    this.selectedItems.removeAt(index);
  }

  // Called when user clicks Save
  save(): void {
    if (this.form.valid) {
      // Return the updated data to the caller
      this.emitData(this.form.value as EditMenuData);
    }
  }
}
