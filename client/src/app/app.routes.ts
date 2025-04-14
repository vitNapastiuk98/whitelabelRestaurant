import {Routes} from '@angular/router';
import {adminGuard} from './core/guardes/isAdmin/admin.guard';
import {guestGuard} from './core/guardes/isGuest/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./content/restaurant/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./content/restaurant/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'menu',
    loadComponent: () => import('./content/restaurant/menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'specialty',
    loadComponent: () => import('./content/restaurant/specialties/specialties.component').then(m => m.SpecialtiesComponent),
  },
  {
    path: 'events',
    loadComponent: () => import('./content/restaurant/events/events.component').then(m => m.EventsComponent),
  },


  {
    path: 'reservation',
    loadComponent: () => import('./content/restaurant/reservation/reservation.component').then(m => m.ReservationComponent),
  },

  {
    path: 'contact',
    loadComponent: () => import('./content/restaurant/contacts/contacts.component').then(m => m.ContactsComponent),
  },

  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./content/admin/login/login.component').then(m => m.LoginComponent),
  },

  {
    path: 'admin/signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./content/admin/signup/signup.component').then(m => m.SignupComponent),

  }, {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'content',
        loadComponent: () => import('./content/admin/content/content.component').then(m => m.ContentComponent),
      },
      {path: 'reservations',
        loadComponent: () => import('./content/admin/reservations/reservations.component').then(m => m.ReservationsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./content/admin/settings/settings.component').then(m => m.SettingsComponent),
      }

    ]
  }
];
