import { Component, ElementRef, ViewChild, input, model, output, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements FormValueControl<string | null> {
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;
  readonly value = model<string | null>(null);
  readonly disabled = input(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  readonly accept = input('image/png,image/jpeg,image/webp,image/gif');
  readonly error = signal('');

  onSelectFile(): void {
    if (!this.disabled()) this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    if (this.disabled()) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.error.set('');
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 1024 * 1024) {
      this.error.set('Scegli un’immagine PNG, JPEG, WebP o GIF fino a 1 MB.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.value.set(reader.result as string);
    };
    reader.onerror = () => {
      this.error.set('Impossibile leggere l’immagine. Riprova.');
    };
    reader.readAsDataURL(file);
  }
}
