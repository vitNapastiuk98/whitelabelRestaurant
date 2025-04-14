import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {inject} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

export abstract class ModalBase<T = any> {
  // Instead of receiving these via constructor, we use inject()
  protected dialogRef = inject(MatDialogRef) as MatDialogRef<any>;
  protected data = inject(MAT_DIALOG_DATA) as T;

  close(): void {
    this.dialogRef.close();
  }

  emitData(data: T): void {
    this.dialogRef.close(data);
  }

  getFormGroup(ctrl: AbstractControl): FormGroup {
    return ctrl as FormGroup;
  }
}
