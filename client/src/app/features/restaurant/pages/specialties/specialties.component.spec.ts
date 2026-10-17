import { componentTestProviders } from '../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesComponent } from './specialties.component';
import { WhitelabelService } from '../../../whitelabel/data-access/whitelabel.service';

describe('SpecialtiesComponent', () => {
  let component: SpecialtiesComponent;
  let fixture: ComponentFixture<SpecialtiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [SpecialtiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses real menu prices, including free items, and leaves unknown prices absent', () => {
    TestBed.inject(WhitelabelService).config.set({ whitelabelId: 'test', content: { menu: { title: 'Menu', description: '', categories: [
      { name: 'Primi', items: [{ name: 'Carbonara', price: 14.5 }, { name: 'Acqua', price: 0 }] }
    ] } } });
    expect(component.priceFor('carbonara')).toBe(14.5);
    expect(component.priceFor('Acqua')).toBe(0);
    expect(component.priceFor('Unknown')).toBeUndefined();
  });
});
