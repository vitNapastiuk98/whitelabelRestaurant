import { email, form, FormField, maxLength, pattern, required, validate } from '@angular/forms/signals';
import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WhitelabelService } from '../../../whitelabel/data-access/whitelabel.service';
@Component({
    imports: [FormField], selector: 'app-contacts', templateUrl: './contacts.component.html', styleUrls: ['./contacts.component.scss'] })
export class ContactsComponent {
  private http = inject(HttpClient);
  private store = inject(WhitelabelService);
  get address() { return this.store.config()?.contactInfo?.address || ''; }
  get phone() { return this.store.config()?.contactInfo?.phone || ''; }
  get email() { return this.store.config()?.contactInfo?.email || ''; }
  openingHours = [{ day: 'Mar-Ven', hours: '10:00 - 22:00' }, { day: 'Sab-Dom', hours: '10:00 - 00:00' }, { day: 'Lun', hours: 'Chiuso' }];
  contactState = signal<'idle' | 'loading' | 'success'>('idle'); error = signal('');
  readonly model = signal({ fullName: '', userEmail: '', userPhone: '', message: '', consent: false });
  readonly form = form(this.model, fields => {
    required(fields.fullName); pattern(fields.fullName, /\S/); maxLength(fields.fullName, 120);
    required(fields.userEmail); email(fields.userEmail); maxLength(fields.userEmail, 254);
    required(fields.userPhone); pattern(fields.userPhone, /\S/); maxLength(fields.userPhone, 40);
    required(fields.message); pattern(fields.message, /\S/); maxLength(fields.message, 10000); required(fields.consent);
  });

  onSubmit() {
    if (this.contactState() === 'loading') return;
    this.error.set('');
    if (this.form().invalid()) {
      this.form().markAsTouched();
      this.error.set('Completa i campi obbligatori e accetta il consenso.'); return;
    }
    this.contactState.set('loading');
    this.http.post('/api/messages', { name: this.model().fullName, email: this.model().userEmail, phone: this.model().userPhone,
      message: this.model().message, consent: this.model().consent
    }).subscribe({ next: () => this.contactState.set('success'), error: err => {
      this.contactState.set('idle'); this.error.set(err.error?.message || 'Messaggio non inviato. Riprova.');
    } });
  }
  reset() {
    this.form().reset({ fullName: '', userEmail: '', userPhone: '', message: '', consent: false });
    this.error.set(''); this.contactState.set('idle');
  }
}
