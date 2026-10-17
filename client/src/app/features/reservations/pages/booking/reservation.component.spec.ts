import { componentTestProviders } from '../../../../../testing/providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationComponent } from './reservation.component';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: componentTestProviders(),
      imports: [ReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows success only after the server saves the booking', () => {
    component.form.name().value.set('Guest'); component.form.phone().value.set('1234567'); component.form.date().value.set('2026-12-01');
    component.form.time().value.set('19:00'); component.form.consent().value.set(true);
    component.onSubmit();
    expect(component.reservationState()).toBe('loading');
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('/api/reservations');
    expect(request.request.body.guests).toBe(2);
    request.flush({ _id: 'booking' });
    expect(component.reservationState()).toBe('success'); http.verify();
  });

  it('keeps entered details and reports a failed booking', () => {
    component.form.name().value.set('Guest'); component.form.phone().value.set('1234567'); component.form.date().value.set('2026-12-01');
    component.form.time().value.set('19:00'); component.form.consent().value.set(true); component.onSubmit();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/reservations').flush({ message: 'Try again' }, { status: 503, statusText: 'Unavailable' });
    expect(component.reservationState()).toBe('idle'); expect(component.model().name).toBe('Guest');
    expect(component.error()).toBe('Try again'); http.verify();
  });
  it('validates consent and optional email before sending a booking', () => {
    component.model.set({ name: 'Guest', email: 'invalid', phone: '1234567', people: '2', date: '2099-12-01', time: '19:00', consent: true });
    component.onSubmit();
    const http = TestBed.inject(HttpTestingController);
    http.expectNone('/api/reservations');
    expect(component.form.email().invalid()).toBeTrue();
    component.form.email().value.set('');
    component.form.consent().value.set(false);
    component.onSubmit();
    http.expectNone('/api/reservations');
    expect(component.form.consent().invalid()).toBeTrue();
    http.verify();
  });

  it('keeps the draft immutable and resets signal form state after success', () => {
    const draft = { name: 'Guest', email: '', phone: '1234567', people: '2', date: '2099-12-01', time: '19:00', consent: true };
    component.model.set(draft);
    component.form.name().value.set('Updated Guest');
    expect(draft.name).toBe('Guest');
    component.onSubmit();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/reservations').flush({ _id: 'booking' });
    component.reset();
    expect(component.model().name).toBe('');
    expect(component.model().consent).toBeFalse();
    expect(component.reservationState()).toBe('idle');
    expect(component.form().touched()).toBeFalse();
    http.verify();
  });

});
