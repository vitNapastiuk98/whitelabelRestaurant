import { Component, signal } from '@angular/core';
import {ModalBase} from '../modal.base';
import { FormField, form, applyEach, required, min } from '@angular/forms/signals';
import {EditMenuData} from '../../../domain/content.model';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-edit-menu-modal',
  imports: [
    FormField,
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
export class EditMenuModalComponent extends ModalBase<EditMenuData> {
  readonly model = signal({
    title: this.data?.title || '',
    description: this.data?.description || '',
    categories: (this.data?.categories || []).map(category => ({
      name: category.name,
      items: category.items.map(item => ({
        name: item.name,
        price: item.price,
        description: item.description || '',
        allergens: item.allergens || '',
        photo: item.photo || null,
      })),
    })),
  });
  readonly form = form(this.model, path => {
    required(path.title);
    applyEach(path.categories, category => {
      required(category.name);
      applyEach(category.items, item => {
        required(item.name);
        required(item.price);
        min(item.price, 0);
      });
    });
  });
  readonly selectedCategoryIndex = signal(0);

  get selectedCategory() {
    return this.selectedCategoryIndex() < this.model().categories.length
      ? this.form.categories[this.selectedCategoryIndex()] : undefined;
  }

  addCategory(): void {
    this.model.update(value => ({ ...value, categories: [...value.categories, { name: 'Nuova categoria', items: [] }] }));
    this.selectedCategoryIndex.set(this.model().categories.length - 1);
  }

  removeCategory(): void {
    this.model.update(value => ({ ...value, categories: value.categories.filter((_, i) => i !== this.selectedCategoryIndex()) }));
    this.selectedCategoryIndex.update(index => Math.max(0, index - 1));
  }

  selectCategory(index: number): void {
    this.selectedCategoryIndex.set(index);
  }

  addItem(): void {
    this.model.update(value => ({ ...value, categories: value.categories.map((category, i) =>
      i === this.selectedCategoryIndex()
        ? { ...category, items: [...category.items, { name: '', price: 0, description: '', allergens: '', photo: null }] }
        : category) }));
  }

  removeItem(index: number): void {
    this.model.update(value => ({ ...value, categories: value.categories.map((category, i) =>
      i === this.selectedCategoryIndex()
        ? { ...category, items: category.items.filter((_, j) => j !== index) }
        : category) }));
  }

  save(): void {
    if (this.form().valid()) {
      const { title, description, categories } = this.model();
      this.emitData({ title, description, categories: categories.map(({ name, items }) => ({
        name, items: items.map(({ name, price, description, allergens, photo }) => ({
          name, price, description, allergens, photo: photo || undefined,
        })),
      })) });
    }
  }
}
