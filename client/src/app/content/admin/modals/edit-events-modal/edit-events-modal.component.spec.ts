import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventsModalComponent } from './edit-events-modal.component';

describe('EditEventsModalComponent', () => {
  let component: EditEventsModalComponent;
  let fixture: ComponentFixture<EditEventsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEventsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
