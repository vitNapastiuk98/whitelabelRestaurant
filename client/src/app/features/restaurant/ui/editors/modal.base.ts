import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { inject } from '@angular/core';

export abstract class ModalBase<T = unknown, TResult = T> {
  protected readonly dialogRef = inject<MatDialogRef<unknown, TResult>>(MatDialogRef);
  protected readonly data = inject<T>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }

  emitData(data: TResult): void {
    this.dialogRef.close(data);
  }
}
