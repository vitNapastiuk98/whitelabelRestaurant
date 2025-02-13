import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('.' +
    '/content/sections/about/about.component').then(m => m.AboutComponent),
  }
];
