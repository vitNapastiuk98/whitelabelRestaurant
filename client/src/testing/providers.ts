import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export function componentTestProviders() {
  return [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations(),
    { provide: MAT_DIALOG_DATA, useValue: null },
    { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }];
}
