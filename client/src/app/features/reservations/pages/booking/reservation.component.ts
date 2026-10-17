import { email, form, FormField, maxLength, pattern, required, validate } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { Component, signal, inject } from '@angular/core';
@Component({
    imports: [FormField], selector: 'app-reservation', templateUrl: './reservation.component.html', styleUrls: ['./reservation.component.scss'] })
export class ReservationComponent {
  private http = inject(HttpClient);
  openingHours = [{ day: 'Mar-Ven', hours: '10:00 - 22:00' }, { day: 'Sab-Dom', hours: '10:00 - 00:00' }, { day: 'Lun', hours: 'Chiuso' }];
  reservationState = signal<'idle' | 'loading' | 'success'>('idle');
  error = signal('');
  minDate = [new Date().getFullYear(), String(new Date().getMonth() + 1).padStart(2, '0'), String(new Date().getDate()).padStart(2, '0')].join('-');
  readonly model = signal({ name: '', email: '', phone: '', people: '2', date: '', time: '', consent: false });
  readonly form = form(this.model, fields => {
    required(fields.name); pattern(fields.name, /\S/); maxLength(fields.name, 120);
    email(fields.email); maxLength(fields.email, 254); required(fields.phone); pattern(fields.phone, /\S/); maxLength(fields.phone, 40);
    required(fields.date); validate(fields.date, ({ value }) => value() && value() < this.minDate ? { kind: 'pastDate' } : undefined);
    required(fields.time); pattern(fields.time, /^(12:00|12:30|13:00|13:30|19:00|19:30|20:00|20:30|21:00)$/);
    pattern(fields.people, /^(10|[1-9])$/); required(fields.consent);
  });

  onSubmit() {
    if (this.reservationState() === 'loading') return;
    this.error.set('');
    if (this.form().invalid()) {
      this.form().markAsTouched();
      this.error.set('Compila i campi obbligatori e accetta il consenso.'); return;
    }
    this.reservationState.set('loading');
    this.http.post('/api/reservations', { name: this.model().name, email: this.model().email, phone: this.model().phone,
      guests: Number(this.model().people), date: this.model().date, time: this.model().time, consent: this.model().consent
    }).subscribe({ next: () => this.reservationState.set('success'), error: err => {
      this.reservationState.set('idle'); this.error.set(err.error?.message || 'Prenotazione non inviata. Riprova.');
    } });
  }
  reset() {
    this.form().reset({ name: '', email: '', phone: '', people: '2', date: '', time: '', consent: false });
    this.reservationState.set('idle');
    this.error.set('');
  }
}
