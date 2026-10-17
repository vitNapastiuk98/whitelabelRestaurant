import { componentTestProviders } from '../../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialtiesModalComponent } from './edit-specialties-modal.component';

describe('EditSpecialtiesModalComponent', () => {
  let component: EditSpecialtiesModalComponent;
  let fixture: ComponentFixture<EditSpecialtiesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [EditSpecialtiesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpecialtiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
