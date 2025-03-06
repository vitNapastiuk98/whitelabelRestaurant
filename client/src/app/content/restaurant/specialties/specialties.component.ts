import { Component, signal } from '@angular/core';

interface SpecialtyDish {
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.scss'],
  standalone: true
})
export class SpecialtiesComponent {
  // Signal-based array of dishes
  dishes = signal<SpecialtyDish[]>([
    {
      name: 'Spaghetti alla carbonara',
      price: 14.5,
      image: '/carbonara.png',
    },
    {
      name: 'Branzino al limone',
      price: 14.5,
      image: '/branzino.png',
    },
    {
      name: 'Tiramisù Classico',
      price: 14.5,
      image: '/tiramisu.png',
    }
  ]);
}
