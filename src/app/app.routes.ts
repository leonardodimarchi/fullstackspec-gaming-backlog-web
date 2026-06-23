import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { ShellComponent } from './layout/shell.component';
import { AuthLayoutComponent } from './layout/auth-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/auth/login.page').then((m) => m.LoginPage),
      },
    ],
  },
  {
    path: 'register',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/auth/register.page').then((m) => m.RegisterPage),
      },
    ],
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/games/home.page').then((m) => m.HomePage),
      },
      {
        path: 'games',
        loadComponent: () =>
          import('./features/games/games-catalog.page').then((m) => m.GamesCatalogPage),
      },
      {
        path: 'games/:igdbId',
        loadComponent: () =>
          import('./features/games/game-detail.page').then((m) => m.GameDetailPage),
      },
      {
        path: 'backlog',
        loadComponent: () =>
          import('./features/backlog/backlog.page').then((m) => m.BacklogPage),
      },
      {
        path: 'backlog/:id',
        loadComponent: () =>
          import('./features/backlog/backlog-entry.page').then((m) => m.BacklogEntryPage),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-dashboard.page').then((m) => m.AdminDashboardPage),
      },
      {
        path: 'admin/users',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-users.page').then((m) => m.AdminUsersPage),
      },
      {
        path: 'admin/users/new',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-user-form.page').then((m) => m.AdminUserFormPage),
      },
      {
        path: 'admin/users/:id/edit',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-user-form.page').then((m) => m.AdminUserFormPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
