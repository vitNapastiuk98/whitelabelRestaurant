import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAboutModalComponent } from './edit-about-modal.component';

describe('EditAboutModalComponent', () => {
  let component: EditAboutModalComponent;
  let fixture: ComponentFixture<EditAboutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAboutModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAboutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
