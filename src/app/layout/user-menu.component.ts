import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-user-menu',
  imports: [RouterLink],
  template: `
    <div class="user-menu">
      <button
        type="button"
        class="user-menu__trigger"
        (click)="toggle()"
        (blur)="onBlur()"
        aria-haspopup="true"
        [attr.aria-expanded]="open()"
      >
        <span class="user-menu__avatar">{{ initial() }}</span>
        <span class="user-menu__name hidden sm:inline">{{ auth.currentUser()?.name }}</span>
        <svg class="user-menu__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      @if (open()) {
        <div class="user-menu__dropdown" (mousedown)="$event.preventDefault()">
          <div class="user-menu__header">
            <span class="user-menu__avatar user-menu__avatar--lg">{{ initial() }}</span>
            <div class="min-w-0">
              <p class="truncate font-medium">{{ auth.currentUser()?.name }}</p>
              <p class="truncate text-xs text-text-muted">{{ auth.currentUser()?.email }}</p>
            </div>
          </div>
          @if (auth.isAdmin()) {
            <a routerLink="/admin" class="user-menu__item" (click)="close()">Painel admin</a>
          }
          <button type="button" class="user-menu__item user-menu__item--danger" (click)="logout()">
            Sair
          </button>
        </div>
      }
    </div>
  `,
})
export class UserMenuComponent {
  readonly auth = inject(AuthService);
  readonly open = signal(false);

  readonly initial = computed(() => {
    const name = this.auth.currentUser()?.name?.trim();
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }

  logout(): void {
    this.close();
    this.auth.logout();
  }
}
