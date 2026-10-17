import { Routes } from '@angular/router';
import { adminGuard } from './features/identity/guards/isAdmin/admin.guard';
import { guestGuard } from './features/identity/guards/isGuest/guest.guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/restaurant/pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'about', loadComponent: () => import('./features/restaurant/pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'menu', loadComponent: () => import('./features/restaurant/pages/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'specialty', loadComponent: () => import('./features/restaurant/pages/specialties/specialties.component').then(m => m.SpecialtiesComponent) },
  { path: 'events', loadComponent: () => import('./features/restaurant/pages/events/events.component').then(m => m.EventsComponent) },
  { path: 'reservation', loadComponent: () => import('./features/reservations/pages/booking/reservation.component').then(m => m.ReservationComponent) },
  { path: 'contact', loadComponent: () => import('./features/restaurant/pages/contacts/contacts.component').then(m => m.ContactsComponent) },
  { path: 'admin/login', canActivate: [guestGuard], loadComponent: () => import('./features/identity/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin/signup', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: 'admin', canActivate: [adminGuard], canActivateChild: [adminGuard], children: [
    { path: '', redirectTo: 'content', pathMatch: 'full' },
    { path: 'content', loadComponent: () => import('./features/restaurant/pages/editor/content.component').then(m => m.ContentComponent) },
    { path: 'reservations', loadComponent: () => import('./features/reservations/pages/inbox/reservations.component').then(m => m.ReservationsComponent) },
    { path: 'settings', loadComponent: () => import('./features/whitelabel/pages/settings/settings.component').then(m => m.SettingsComponent) },
  ] },
  { path: '**', redirectTo: '' },
];
