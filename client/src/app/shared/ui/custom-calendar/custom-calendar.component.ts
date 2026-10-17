import {Component, input, signal} from '@angular/core';
import {
  MatFormFieldModule,
  MatLabel
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe
  ],
})
export class CustomCalendarComponent {
  // Signal-based date
  selectedDate = signal<Date | null>(null);
  label = input('Seleziona data')

  // Example handler
  onDateChange(date: Date | null) {
    this.selectedDate.set(date);
  }
}
