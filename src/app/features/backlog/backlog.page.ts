import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserGamesService } from '../../core/services/user-games.service';
import { GAME_STATUS_LABELS } from '../../shared/constants/labels';
import { GameStatus } from '../../shared/enums/game-status.enum';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { StatusTabsComponent } from '../../shared/components/status-tabs.component';
import { UserGame } from '../../shared/models/user-game.model';

@Component({
  selector: 'app-backlog-page',
  imports: [
    RouterLink,
    StatusTabsComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
  ],
  template: `
    <div>
      <h1 class="page-title">Meu backlog</h1>
      <p class="page-subtitle mb-6">Organize seus jogos por status.</p>

      <app-status-tabs
        class="mb-6 block"
        [active]="activeStatus()"
        [counts]="counts()"
        (statusChange)="onStatusChange($event)"
      />

      @if (loading()) {
        <app-loading-spinner />
      } @else if (entries().length === 0) {
        <div class="py-12 text-center">
          <p class="text-text-muted">Nenhum jogo nesta lista.</p>
          <a routerLink="/games" class="btn-primary mt-4 inline-flex">Explorar jogos</a>
        </div>
      } @else {
        <div class="space-y-3">
          @for (entry of entries(); track entry.id) {
            <a [routerLink]="['/backlog', entry.id]" class="card flex gap-4 p-4 transition-colors hover:border-primary/50">
              <div class="h-20 w-14 shrink-0 overflow-hidden rounded bg-surface-overlay">
                @if (entry.game?.coverUrl) {
                  <img [src]="entry.game!.coverUrl" [alt]="entry.game!.name" class="h-full w-full object-cover" />
                }
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="truncate font-semibold">{{ entry.game?.name ?? 'Jogo #' + entry.igdbId }}</h3>
                <p class="mt-1 text-sm text-text-muted">{{ statusLabels[entry.status] }}</p>
                @if (entry.playedTime !== undefined && entry.playedTime !== null) {
                  <p class="text-xs text-text-muted">{{ entry.playedTime }}h jogadas</p>
                }
              </div>
            </a>
          }
        </div>
        <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="onPageChange($event)" />
      }
    </div>
  `,
})
export class BacklogPage implements OnInit {
  private readonly userGamesService = inject(UserGamesService);

  readonly loading = signal(true);
  readonly entries = signal<UserGame[]>([]);
  readonly counts = signal<Record<GameStatus, number> | null>(null);
  readonly activeStatus = signal<GameStatus | null>(null);
  readonly page = signal(1);
  readonly totalPages = signal(1);

  readonly statusLabels = GAME_STATUS_LABELS;

  ngOnInit(): void {
    this.userGamesService.getCounts().subscribe((c) => this.counts.set(c));
    this.loadEntries();
  }

  onStatusChange(status: GameStatus | null): void {
    this.activeStatus.set(status);
    this.page.set(1);
    this.loadEntries();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadEntries();
  }

  private loadEntries(): void {
    this.loading.set(true);
    this.userGamesService
      .list({
        page: this.page(),
        limit: 20,
        status: this.activeStatus() ?? undefined,
      })
      .subscribe({
        next: (res) => {
          this.entries.set(res.data);
          this.totalPages.set(res.meta.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
