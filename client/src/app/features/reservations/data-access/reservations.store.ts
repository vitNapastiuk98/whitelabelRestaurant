import { computed, inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { tap } from 'rxjs';
import { GuestMessage, Reservation } from '../domain/reservation.model';

@Injectable()
export class ReservationsStore {
  private readonly http = inject(HttpClient);
  readonly bookings = httpResource<Reservation[]>(() => '/api/reservations', { defaultValue: [] });
  readonly messages = httpResource<GuestMessage[]>(() => '/api/messages', { defaultValue: [] });
  readonly loading = computed(() => this.bookings.isLoading() || this.messages.isLoading());
  readonly error = computed(() => this.bookings.error() ? 'Impossibile caricare le prenotazioni.'
    : this.messages.error() ? 'Impossibile caricare i messaggi.' : '');

  reload() { this.bookings.reload(); this.messages.reload(); }
  remove(id: string) {
    return this.http.delete(`/api/reservations/${id}`).pipe(tap(() => {
      if (this.bookings.hasValue()) this.bookings.update(items => items.filter(item => item._id !== id));
    }));
  }
}
