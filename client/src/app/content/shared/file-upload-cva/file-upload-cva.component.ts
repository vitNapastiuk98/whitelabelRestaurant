import {
  Component,
  forwardRef,
  ElementRef,
  ViewChild,
  Input, input
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-file-upload-cva',
  templateUrl: './file-upload-cva.component.html',
  styleUrls: ['./file-upload-cva.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadCvaComponent),
      multi: true,
    },
  ],
  imports: [
    NgOptimizedImage
  ]
})
export class FileUploadCvaComponent implements ControlValueAccessor {
  @ViewChild('fileInput', {static: true}) fileInput!: ElementRef<HTMLInputElement>;

  /**
   * Accept attribute for the file input (e.g. "image/*", "application/pdf", ")
   * Default is "*" (any file type).
   * */
   accept = input('*/*');

  /**
   * The raw File object currently selected, or null if none.
   */
  private _value: File | null = null;

  /**
   * Base64 preview if this is an image file (or null otherwise).
   */
  previewData: string | null = null;

  /**
   * Whether the component is disabled
   */
  disabled = false;

  // ControlValueAccessor calllbacks
  private onChangeFn: (value: File | null) => void = () => {
  };
  private onTouchedFn: () => void = () => {
  };

  // ====== ControlValueAccessor Interface ======

  writeValue(value: File | null): void {
    this._value = value;
    this.loadPreviewIfImage(value);
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ====== UI Handlers ======

  /**
   * Called when user clicks the container. Opens the file dialog (unless disabled).
   */
  onSelectFile(): void {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * Called when a file is selected in the file dialog.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;

    this._value = file;
    this.loadPreviewIfImage(file);

    // Notify form
    this.onChangeFn(file);
    this.onTouchedFn();
  }

  // ====== Helpers ======

  private loadPreviewIfImage(file: File | null): void {
    this.previewData = null;
    if (!file) {
      return;
    }
    // Check if the file is likely an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewData = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * If we have a non-image file, show the file name or an icon.
   */
  get isImageFile(): boolean {
    return !!this._value && this._value.type.startsWith('image/');
  }

  get fileName(): string | null {
    return this._value?.name || null;
  }
}
