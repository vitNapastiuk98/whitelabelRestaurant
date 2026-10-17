import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestMessage, Reservation } from '../../domain/reservation.model';
import { ReservationsComponent } from './reservations.component';

describe('ReservationsComponent', () => {
  let component: ReservationsComponent;
  let fixture: ComponentFixture<ReservationsComponent>;
  let http: HttpTestingController;
  const booking: Reservation = { _id: 'booking-1', name: 'Guest', phone: '1234567', email: 'guest@example.com', date: '2026-12-01', time: '19:00', guests: 2 };
  const message: GuestMessage = { _id: 'message-1', name: 'Visitor', phone: '7654321', email: 'visitor@example.com', message: 'Hello', createdAt: '2026-10-17T12:00:00Z' };
  const settle = async () => { await fixture.whenStable(); fixture.detectChanges(); };
  const load = async () => {
    http.expectOne('/api/reservations').flush([booking]);
    http.expectOne('/api/messages').flush([message]);
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReservationsComponent], providers: [provideHttpClient(), provideHttpClientTesting()] }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  it('loads both resources and remains busy until both finish', async () => {
    expect(component.loading()).toBeTrue();
    expect(component.reservations()).toEqual([]);
    expect(component.messages()).toEqual([]);
    http.expectOne('/api/reservations').flush([booking]);
    TestBed.tick();
    expect(component.loading()).toBeTrue();
    http.expectOne('/api/messages').flush([message]);
    await settle();
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
    expect(component.reservations()).toEqual([booking]);
    expect(component.messages()).toEqual([message]);
    expect(fixture.nativeElement.textContent).toContain('Guest');
    expect(fixture.nativeElement.textContent).toContain('Hello');
  });

  for (const failed of ['reservations', 'messages'] as const) {
    it(`keeps the other inbox usable when ${failed} fail and recovers on retry`, async () => {
      const success = failed === 'reservations' ? 'messages' : 'reservations';
      http.expectOne(`/api/${failed}`).flush({ message: 'Unavailable' }, { status: 503, statusText: 'Unavailable' });
      http.expectOne(`/api/${success}`).flush(success === 'messages' ? [message] : [booking]);
      await settle();
      expect(component.loading()).toBeFalse();
      expect(component.error()).toContain(failed === 'reservations' ? 'prenotazioni' : 'messaggi');
      expect(failed === 'reservations' ? component.messages() : component.reservations()).toEqual(failed === 'reservations' ? [message] : [booking]);
      component.load();
      fixture.detectChanges();
      expect(component.loading()).toBeTrue();
      await load();
      expect(component.error()).toBe('');
      expect(component.reservations()).toEqual([booking]);
      expect(component.messages()).toEqual([message]);
    });
  }

  it('preserves bookings after a deletion failure and removes them only after a successful response', async () => {
    await load();
    spyOn(window, 'confirm').and.returnValue(true);
    component.remove(booking._id);
    expect(component.deleting()).toBe(booking._id);
    expect(component.reservations()).toEqual([booking]);
    component.remove(booking._id);
    const first = http.expectOne(`/api/reservations/${booking._id}`);
    expect(first.request.method).toBe('DELETE');
    first.flush({ message: 'Unavailable' }, { status: 503, statusText: 'Unavailable' });
    await settle();
    expect(component.deleting()).toBeNull();
    expect(component.reservations()).toEqual([booking]);
    expect(component.error()).toContain('Eliminazione non riuscita');
    component.remove(booking._id);
    expect(component.error()).toBe('');
    expect(component.reservations()).toEqual([booking]);
    http.expectOne(`/api/reservations/${booking._id}`).flush({ deleted: true });
    await settle();
    expect(component.deleting()).toBeNull();
    expect(component.reservations()).toEqual([]);
    expect(component.messages()).toEqual([message]);
  });

  it('does not delete a booking when confirmation is cancelled', async () => {
    await load();
    spyOn(window, 'confirm').and.returnValue(false);
    component.remove(booking._id);
    http.expectNone(`/api/reservations/${booking._id}`);
    expect(component.deleting()).toBeNull();
    expect(component.reservations()).toEqual([booking]);
  });
});
