import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users').then(m => m.Users),
    canActivate: [authGuard]
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/roles/roles').then(m => m.Roles),
    canActivate: [authGuard]
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('./pages/audit/audit').then(m => m.Audit),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  {
    path: 'super-admin',
    loadComponent: () =>
      import('./pages/super-admin/super-admin').then(m => m.SuperAdmin),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];