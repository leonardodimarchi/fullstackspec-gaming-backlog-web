import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { ToastContainerComponent } from '../shared/components/toast-container.component';
import { UserMenuComponent } from './user-menu.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UserMenuComponent, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a routerLink="/" class="text-lg font-bold text-text shrink-0">
            <span class="text-primary">Gaming</span> Backlog
          </a>

          @if (auth.isAuthenticated()) {
            <div class="flex items-center gap-2 sm:gap-3">
              <nav class="flex items-center gap-0.5 overflow-x-auto sm:gap-1">
                <a routerLink="/" routerLinkActive="text-primary bg-surface-overlay" class="btn-ghost whitespace-nowrap text-xs sm:text-sm" [routerLinkActiveOptions]="{ exact: true }">
                  Home
                </a>
                <a routerLink="/games" routerLinkActive="text-primary bg-surface-overlay" class="btn-ghost whitespace-nowrap text-xs sm:text-sm">Jogos</a>
                <a routerLink="/backlog" routerLinkActive="text-primary bg-surface-overlay" class="btn-ghost whitespace-nowrap text-xs sm:text-sm">Backlog</a>
                @if (auth.isAdmin()) {
                  <a routerLink="/admin" routerLinkActive="text-primary bg-surface-overlay" class="btn-ghost whitespace-nowrap text-xs sm:text-sm">Admin</a>
                }
              </nav>
              <app-user-menu />
            </div>
          }
        </div>
      </header>

      <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <router-outlet />
      </main>

      <app-toast-container />
    </div>
  `,
})
export class ShellComponent {
  readonly auth = inject(AuthService);
}
