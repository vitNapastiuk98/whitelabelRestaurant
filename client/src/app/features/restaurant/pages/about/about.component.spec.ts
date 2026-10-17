import { componentTestProviders } from '../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [AboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps editable statistic labels while separating their numbers', () => {
    expect(component.splitTag('20+ anni di esperienza')).toEqual({ value: '20+', label: 'anni di esperienza' });
    expect(component.splitTag('Cucina di famiglia')).toEqual({ value: '', label: 'Cucina di famiglia' });
  });
});
