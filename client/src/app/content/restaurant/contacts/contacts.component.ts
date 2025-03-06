import { Component, signal } from '@angular/core';

type ContactState = 'idle' | 'loading' | 'success';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  standalone: true,
})
export class ContactsComponent {
  // Left panel data
  address = 'C.so Giulio Cesare 98, 10125 Roma RM';
  phone = '+39 385 825 8955';
  email = 'info@erspaghetto.it';
  openingHours = [
    { day: 'Mar-Ven', hours: '10:00 AM - 22:00 PM' },
    { day: 'Sab-Dom', hours: '10:00 AM - 00:00 AM' },
    { day: 'Lun', hours: 'Chiuso' },
  ];

  // Form fields as signals
  fullName = signal('');
  userEmail = signal('');
  userPhone = signal('');
  message = signal('');
  consent = signal(false);

  // Submission state
  contactState = signal<ContactState>('idle');

  // Simulate form submit
  onSubmit(): void {
    // Basic validation
    if (!this.fullName() || !this.userEmail() || !this.userPhone() || !this.consent()) {
      alert('Completa i campi obbligatori e accetta il consenso.');
      return;
    }

    this.contactState.set('loading');

    // Simulate async request
    setTimeout(() => {
      this.contactState.set('success');
    }, 1500);
  }
}
