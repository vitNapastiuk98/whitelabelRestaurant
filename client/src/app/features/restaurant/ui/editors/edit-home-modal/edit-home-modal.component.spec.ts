import { componentTestProviders } from '../../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHomeModalComponent } from './edit-home-modal.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('EditHomeModalComponent', () => {
  let component: EditHomeModalComponent;
  let fixture: ComponentFixture<EditHomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [EditHomeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saves edited slides through the visible save button', () => {
    component.addItem();
    component.form.items[0].file().value.set('/hero-spaghetti.jpg');
    component.form.items[0].text1().value.set('First line');
    component.form.items[0].text2().value.set('Second line');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('mat-dialog-actions button:last-child').click();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalledWith([
      { file: '/hero-spaghetti.jpg', text1: 'First line', text2: 'Second line' }
    ]);
  });
});
