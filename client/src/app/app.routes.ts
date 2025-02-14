import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./content/restaurant/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'menu',
    loadComponent: () => import('./content/restaurant/menu/menu.component').then(m => m.MenuComponent)
  },
  { path: 'specialty',
    loadComponent: () => import('./content/restaurant/specialities/specialities.component').then(m => m.SpecialitiesComponent),
  },

  { path: 'contacts',
    loadComponent: () => import('./content/restaurant/reservation/reservation.component').then(m => m.ReservationComponent),
  },
];
