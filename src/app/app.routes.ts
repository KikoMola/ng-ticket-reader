import { Routes } from '@angular/router';
import { LandingComponent } from './layout/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'register',
    loadComponent: () => import('./layout/register/register.component')
  },
  {
    path: 'login',
    loadComponent: () => import('./layout/login/login.component')
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/dashboard/dashboard.component')
  },
  {
    path: 'faqs',
    loadComponent: () => import('./layout/faqs/faqs.component')
  },
  {
    path: '**',
    redirectTo: '',
  },
];
