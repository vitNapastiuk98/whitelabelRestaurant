import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ReservationsStore } from '../../data-access/reservations.store';

@Component({ selector: 'app-reservations', imports: [DatePipe], providers: [ReservationsStore],
  templateUrl: './reservations.component.html', styleUrl: './reservations.component.scss' })
export class ReservationsComponent {
  private readonly store = inject(ReservationsStore);
  readonly reservations = computed(() => this.store.bookings.hasValue() ? this.store.bookings.value() : []);
  readonly messages = computed(() => this.store.messages.hasValue() ? this.store.messages.value() : []);
  readonly loading = this.store.loading;
  private readonly deleteError = signal('');
  readonly error = computed(() => this.deleteError() || this.store.error());
  readonly deleting = signal<string | null>(null);

  load() { this.deleteError.set(''); this.store.reload(); }
  remove(id: string) {
    if (this.deleting() || !confirm('Eliminare questa prenotazione?')) return;
    this.deleting.set(id);
    this.deleteError.set('');
    this.store.remove(id).pipe(finalize(() => this.deleting.set(null))).subscribe({
      error: () => this.deleteError.set('Eliminazione non riuscita. Riprova.'),
    });
  }
}
