import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenuModalComponent } from './edit-menu-modal.component';

describe('EditMenuModalComponent', () => {
  let component: EditMenuModalComponent;
  let fixture: ComponentFixture<EditMenuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMenuModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
