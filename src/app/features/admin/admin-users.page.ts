import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { USER_ROLE_LABELS } from '../../shared/constants/labels';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin-users-page',
  imports: [RouterLink, DatePipe, LoadingSpinnerComponent, PaginationComponent],
  template: `
    <div>
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="page-title">Usuários</h1>
          <p class="page-subtitle">Gerencie contas do sistema.</p>
        </div>
        <div class="flex gap-2">
          <a routerLink="/admin" class="btn-ghost">Dashboard</a>
          <a routerLink="/admin/users/new" class="btn-primary">Novo usuário</a>
        </div>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (users().length === 0) {
        <p class="py-12 text-center text-text-muted">Nenhum usuário encontrado.</p>
      } @else {
        <div class="card overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-border text-text-muted">
              <tr>
                <th class="px-4 py-3 font-medium">Nome</th>
                <th class="px-4 py-3 font-medium">E-mail</th>
                <th class="px-4 py-3 font-medium">Papel</th>
                <th class="px-4 py-3 font-medium">Criado em</th>
                <th class="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr class="border-b border-border/50 hover:bg-surface-overlay/50">
                  <td class="px-4 py-3">{{ user.name }}</td>
                  <td class="px-4 py-3 text-text-muted">{{ user.email }}</td>
                  <td class="px-4 py-3">{{ roleLabels[user.role] }}</td>
                  <td class="px-4 py-3 text-text-muted">{{ user.createdAt | date: 'short' }}</td>
                  <td class="px-4 py-3 text-right">
                    <a [routerLink]="['/admin/users', user.id, 'edit']" class="text-primary hover:underline">
                      Editar
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="onPageChange($event)" />
      }
    </div>
  `,
})
export class AdminUsersPage implements OnInit {
  private readonly usersService = inject(UsersService);

  readonly loading = signal(true);
  readonly users = signal<User[]>([]);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly roleLabels = USER_ROLE_LABELS;

  ngOnInit(): void {
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.usersService.list({ page: this.page(), limit: 20 }).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.totalPages.set(res.meta.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
