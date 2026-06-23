import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="mx-auto w-full max-w-md">
      <h1 class="page-title">Entrar</h1>
      <p class="page-subtitle mb-6">Acesse sua conta para gerenciar seu backlog.</p>

      <form class="card space-y-4 p-6" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div>
          <label class="label" for="email">E-mail</label>
          <input id="email" class="input" type="email" formControlName="email" autocomplete="email" />
        </div>
        <div>
          <label class="label" for="password">Senha</label>
          <input id="password" class="input" type="password" formControlName="password" autocomplete="current-password" />
        </div>
        @if (error()) {
          <p class="text-sm text-danger">{{ error() }}</p>
        }
        <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-text-muted">
        Não tem conta?
        <a routerLink="/register" class="text-primary hover:underline">Cadastre-se</a>
      </p>
    </div>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.notification.clear();

    this.auth.login({
      email: this.form.controls.email.value.trim(),
      password: this.form.controls.password.value,
    }).subscribe({
      next: () => {
        void this.router.navigate([this.auth.isAdmin() ? '/admin' : '/']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.error.set('E-mail ou senha inválidos.');
        } else if (err.status === 0) {
          this.error.set(
            'Não foi possível conectar à API. Verifique se ela está rodando em http://localhost:3000.',
          );
        } else {
          this.error.set('Não foi possível entrar.');
        }
      },
    });
  }
}
