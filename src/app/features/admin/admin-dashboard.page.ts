import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import {
  AVAILABILITY_LABELS,
  GAME_STATUS_LABELS,
} from '../../shared/constants/labels';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { AdminStatistics } from '../../shared/models/admin-statistics.model';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [RouterLink, DecimalPipe, LoadingSpinnerComponent],
  template: `
    <div>
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="page-title">Painel Admin</h1>
          <p class="page-subtitle">Visão geral do sistema.</p>
        </div>
        <a routerLink="/admin/users" class="btn-primary">Gerenciar usuários</a>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (stats(); as s) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="card p-4">
            <p class="text-sm text-text-muted">Total de usuários</p>
            <p class="mt-1 text-3xl font-bold">{{ s.totalUsers }}</p>
            <p class="mt-1 text-xs text-text-muted">
              {{ s.usersByRole.admin }} admin · {{ s.usersByRole.user }} usuários
            </p>
          </div>
          <div class="card p-4">
            <p class="text-sm text-text-muted">Entradas no backlog</p>
            <p class="mt-1 text-3xl font-bold">{{ s.totalUserGames }}</p>
          </div>
          <div class="card p-4">
            <p class="text-sm text-text-muted">Horas jogadas</p>
            <p class="mt-1 text-3xl font-bold">{{ s.totalPlayedHours | number: '1.0-1' }}h</p>
          </div>
          <div class="card p-4">
            <p class="text-sm text-text-muted">Horas 100%</p>
            <p class="mt-1 text-3xl font-bold">{{ s.totalPlayedHoursAllContent | number: '1.0-1' }}h</p>
          </div>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <div class="card p-4">
            <h2 class="mb-4 font-semibold">Jogos por status</h2>
            <ul class="space-y-2">
              @for (item of statusEntries(s); track item.key) {
                <li class="flex justify-between text-sm">
                  <span class="text-text-muted">{{ item.label }}</span>
                  <span class="font-medium">{{ item.value }}</span>
                </li>
              }
            </ul>
          </div>
          <div class="card p-4">
            <h2 class="mb-4 font-semibold">Por disponibilidade</h2>
            <ul class="space-y-2">
              @for (item of availabilityEntries(s); track item.key) {
                <li class="flex justify-between text-sm">
                  <span class="text-text-muted">{{ item.label }}</span>
                  <span class="font-medium">{{ item.value }}</span>
                </li>
              }
            </ul>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardPage implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly loading = signal(true);
  readonly stats = signal<AdminStatistics | null>(null);

  readonly statusLabels = GAME_STATUS_LABELS;
  readonly availabilityLabels = AVAILABILITY_LABELS;

  ngOnInit(): void {
    this.adminService.getStatistics().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusEntries(s: AdminStatistics) {
    return Object.entries(s.userGamesByStatus).map(([key, value]) => ({
      key,
      label: this.statusLabels[key as keyof typeof this.statusLabels],
      value,
    }));
  }

  availabilityEntries(s: AdminStatistics) {
    return Object.entries(s.userGamesByAvailability).map(([key, value]) => ({
      key,
      label: this.availabilityLabels[key as keyof typeof this.availabilityLabels],
      value,
    }));
  }
}
