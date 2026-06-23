import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { UsersService } from '../../core/services/users.service';
import { USER_ROLE_LABELS, USER_ROLES } from '../../shared/constants/labels';
import { UserRole } from '../../shared/enums/user-role.enum';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-admin-user-form-page',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner />
    } @else {
      <div class="mx-auto max-w-lg">
        <a routerLink="/admin/users" class="btn-ghost mb-4">← Voltar</a>
        <h1 class="page-title">{{ isEdit() ? 'Editar usuário' : 'Novo usuário' }}</h1>

        <form class="card mt-6 space-y-4 p-6" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label class="label" for="name">Nome</label>
            <input id="name" class="input" formControlName="name" />
          </div>
          <div>
            <label class="label" for="email">E-mail</label>
            <input id="email" class="input" type="email" formControlName="email" />
          </div>
          <div>
            <label class="label" for="password">
              Senha {{ isEdit() ? '(deixe em branco para manter)' : '' }}
            </label>
            <input id="password" class="input" type="password" formControlName="password" />
          </div>
          <div>
            <label class="label" for="role">Papel</label>
            <select id="role" class="select" formControlName="role">
              @for (role of roles; track role) {
                <option [value]="role">{{ roleLabels[role] }}</option>
              }
            </select>
          </div>

          <div class="flex gap-3">
            <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
              {{ saving() ? 'Salvando...' : 'Salvar' }}
            </button>
            @if (isEdit()) {
              <button type="button" class="btn-danger" [disabled]="deleting()" (click)="onDelete()">
                Excluir
              </button>
            }
          </div>
        </form>
      </div>
    }
  `,
})
export class AdminUserFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly isEdit = signal(false);

  readonly roles = USER_ROLES;
  readonly roleLabels = USER_ROLE_LABELS;

  private userId: string | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: [UserRole.USER],
  });

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    const isNew = this.route.snapshot.url.some((s) => s.path === 'new');
    this.isEdit.set(!isNew && !!this.userId);

    if (this.isEdit() && this.userId) {
      this.loading.set(true);
      this.usersService.getById(this.userId).subscribe({
        next: (user) => {
          this.form.patchValue({
            name: user.name,
            email: user.email,
            role: user.role,
          });
          this.loading.set(false);
        },
        error: () => void this.router.navigate(['/admin/users']),
      });
    } else {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.getRawValue();

    if (this.isEdit() && this.userId) {
      const dto: Record<string, string> = {
        name: v.name,
        email: v.email,
        role: v.role,
      };
      if (v.password) dto['password'] = v.password;

      this.usersService.update(this.userId, dto).subscribe({
        next: () => {
          this.notification.show('Usuário atualizado!', 'success');
          void this.router.navigate(['/admin/users']);
        },
        error: () => this.saving.set(false),
      });
    } else {
      this.usersService
        .create({
          name: v.name,
          email: v.email,
          password: v.password,
          role: v.role,
        })
        .subscribe({
          next: () => {
            this.notification.show('Usuário criado!', 'success');
            void this.router.navigate(['/admin/users']);
          },
          error: () => this.saving.set(false),
        });
    }
  }

  onDelete(): void {
    if (!this.userId || !confirm('Excluir este usuário permanentemente?')) return;

    this.deleting.set(true);
    this.usersService.remove(this.userId).subscribe({
      next: () => void this.router.navigate(['/admin/users']),
      error: () => this.deleting.set(false),
    });
  }
}
