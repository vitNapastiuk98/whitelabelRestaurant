import { Component, effect, signal, Signal, computed } from '@angular/core';

type ReservationState = 'idle' | 'loading' | 'success';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  standalone: true,
})
export class ReservationComponent {
  // Left panel data (opening hours)
  openingHours = [
    { day: 'Mar-Ven', hours: '10:00 AM - 22:00 PM' },
    { day: 'Sab-Dom', hours: '10:00 AM - 00:00 AM' },
    { day: 'Lun', hours: 'Chiuso' },
  ];

  // Signals for form fields
  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  people = signal<string>('1 Persona');
  date = signal<string>('');   // Will be set via custom-calendar
  time = signal<string>('');   // Could also be a select
  consent = signal<boolean>(false);

  // Reservation flow signals
  reservationState = signal<ReservationState>('idle');
  showCalendar = signal<boolean>(false);

  // For the custom date picker
  currentYear = signal<number>(2025);
  currentMonth = signal<number>(0); // 0 = January
  daysInMonth = computed(() => this.getDaysInMonth(this.currentYear(), this.currentMonth()));

  // Keep track of the selected date (day, month, year)
  selectedDay = signal<number | null>(null);

  // Submit form
  onSubmit(): void {
    // Basic validation (optional)
    if (!this.name() || !this.phone() || !this.consent()) {
      alert('Per favore, riempi i campi obbligatori e accetta il consenso.');
      return;
    }
    // Trigger loading
    this.reservationState.set('loading');

    // Simulate async request
    setTimeout(() => {
      // After success
      this.reservationState.set('success');
    }, 2000);
  }

  // When user clicks date field
  toggleCalendar() {
    // Toggle the overlay
    this.showCalendar.update(v => !v);
  }

  // For navigating months in the date picker
  prevMonth() {
    let month = this.currentMonth() - 1;
    let year = this.currentYear();
    if (month < 0) {
      month = 11;
      year--;
    }
    this.currentMonth.set(month);
    this.currentYear.set(year);
  }

  nextMonth() {
    let month = this.currentMonth() + 1;
    let year = this.currentYear();
    if (month > 11) {
      month = 0;
      year++;
    }
    this.currentMonth.set(month);
    this.currentYear.set(year);
  }

  selectDay(day: number) {
    this.selectedDay.set(day);
    // Format date as dd/mm/yyyy
    const d = String(day).padStart(2, '0');
    const m = String(this.currentMonth() + 1).padStart(2, '0');
    const y = this.currentYear();
    this.date.set(`${d}/${m}/${y}`);

    // Hide custom-calendar after selection
    this.showCalendar.set(false);
  }

  getMonthName(month: number): string {
    const monthNames = [
      'Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
      'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'
    ];
    return monthNames[month] || '';
  }


  // Simple helper to get days of a month
  getDaysInMonth(year: number, month: number): number[] {
    const date = new Date(year, month, 1);
    const days: number[] = [];
    while (date.getMonth() === month) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
}
