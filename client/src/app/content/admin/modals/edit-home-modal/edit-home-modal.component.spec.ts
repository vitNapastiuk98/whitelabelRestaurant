import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHomeModalComponent } from './edit-home-modal.component';

describe('EditHomeModalComponent', () => {
  let component: EditHomeModalComponent;
  let fixture: ComponentFixture<EditHomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
