import { Component, signal } from '@angular/core';

interface JazzEvent {
  name: string;
  date: string;
  photo: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
})
export class EventsComponent {
  // Signal-based array of events
  events = signal<JazzEvent[]>([
    {
      name: 'Thursday Jazz Night',
      date: 'Every Thursday at 9 PM',
      photo: '/jazz.jpg',
    },
    {
      name: 'Sunday Jazz Brunch',
      date: 'Every Sunday at 11 AM',
      photo: '/jazz.jpg',
    },
    {
      name: 'Sunday Jazz Brunch',
      date: 'Every Sunday at 11 AM',
      photo: '/jazz.jpg',
    },
    {
      name: 'Sunday Jazz Brunch',
      date: 'Every Sunday at 11 AM',
      photo: '/jazz.jpg',
    },
  ]);
}
