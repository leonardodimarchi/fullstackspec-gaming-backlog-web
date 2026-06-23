import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="mx-auto w-full max-w-md">
      <h1 class="page-title">Criar conta</h1>
      <p class="page-subtitle mb-6">Comece a organizar seus jogos.</p>

      <form class="card space-y-4 p-6" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div>
          <label class="label" for="name">Nome</label>
          <input id="name" class="input" type="text" formControlName="name" autocomplete="name" />
        </div>
        <div>
          <label class="label" for="email">E-mail</label>
          <input id="email" class="input" type="email" formControlName="email" autocomplete="email" />
        </div>
        <div>
          <label class="label" for="password">Senha</label>
          <input id="password" class="input" type="password" formControlName="password" autocomplete="new-password" />
          <p class="mt-1 text-xs text-text-muted">Mínimo de 8 caracteres</p>
        </div>
        @if (error()) {
          <p class="text-sm text-danger">{{ error() }}</p>
        }
        <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-text-muted">
        Já tem conta?
        <a routerLink="/login" class="text-primary hover:underline">Entrar</a>
      </p>
    </div>
  `,
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.notification.clear();

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        void this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.status === 409 ? 'Este e-mail já está em uso.' : 'Não foi possível cadastrar.');
      },
    });
  }
}
