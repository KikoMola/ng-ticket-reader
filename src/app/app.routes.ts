import { Routes } from '@angular/router';
import { LandingComponent } from './layout/landing/landing.component';
import { RegisterComponent } from './layout/register/register.component';
import { LoginComponent } from './layout/login/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { FaqsComponent } from './layout/faqs/faqs.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent
  },
  {
    path: '**',
    redirectTo: '',
  },
];
