import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { GamesService } from '../../core/services/games.service';
import { UserGamesService } from '../../core/services/user-games.service';
import { GAME_STATUS_LABELS } from '../../shared/constants/labels';
import { GameStatus } from '../../shared/enums/game-status.enum';
import { GameGridComponent } from '../../shared/components/game-grid.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { Game } from '../../shared/models/game.model';
import { UserGame } from '../../shared/models/user-game.model';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, GameGridComponent, LoadingSpinnerComponent],
  template: `
    <div class="space-y-10">
      <section class="home-hero card p-6 md:p-8">
        <p class="text-sm text-primary">Bem-vindo de volta</p>
        <h1 class="page-title mt-1">Olá, {{ auth.currentUser()?.name }}!</h1>
        <p class="page-subtitle mt-2 max-w-xl">
          Acompanhe seu backlog, descubra jogos populares e organize o que você quer jogar.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a routerLink="/games" class="btn-primary">Explorar jogos</a>
          <a routerLink="/backlog" class="btn-ghost">Ver meu backlog</a>
        </div>
      </section>

      @if (counts()) {
        <section>
          <h2 class="section-heading">Seu backlog</h2>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            @for (status of backlogStatuses; track status) {
              <a
                [routerLink]="['/backlog']"
                class="home-stat card p-4 transition-colors hover:border-primary/40"
              >
                <span class="home-stat__value">{{ counts()![status] }}</span>
                <span class="home-stat__label">{{ statusLabels[status] }}</span>
              </a>
            }
          </div>
        </section>
      }

      @if (recentEntries().length) {
        <section>
          <div class="flex items-center justify-between gap-4">
            <h2 class="section-heading">Atualizados recentemente</h2>
            <a routerLink="/backlog" class="text-sm text-primary hover:underline">Ver tudo</a>
          </div>
          <div class="mt-4 space-y-2">
            @for (entry of recentEntries(); track entry.id) {
              <a [routerLink]="['/backlog', entry.id]" class="home-recent card flex items-center gap-4 p-3 hover:border-primary/40">
                <div class="h-14 w-10 shrink-0 overflow-hidden rounded bg-surface-overlay">
                  @if (entry.game?.coverUrl) {
                    <img [src]="entry.game!.coverUrl" [alt]="entry.game!.name" class="h-full w-full object-cover" />
                  }
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium">{{ entry.game?.name ?? 'Jogo' }}</p>
                  <p class="text-xs text-text-muted">{{ statusLabels[entry.status] }}</p>
                </div>
              </a>
            }
          </div>
        </section>
      }

      <section>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="section-heading">Jogos populares</h2>
            <p class="mt-1 text-sm text-text-muted">Em alta no IGDB agora</p>
          </div>
          <a routerLink="/games" class="text-sm text-primary hover:underline">Ver catálogo</a>
        </div>

        @if (loadingPopular()) {
          <app-loading-spinner />
        } @else if (popularGames().length) {
          <div class="mt-4">
            <app-game-grid [games]="popularGames()" />
          </div>
        }
      </section>
    </div>
  `,
})
export class HomePage implements OnInit {
  readonly auth = inject(AuthService);
  private readonly gamesService = inject(GamesService);
  private readonly userGamesService = inject(UserGamesService);

  readonly loadingPopular = signal(true);
  readonly popularGames = signal<Game[]>([]);
  readonly counts = signal<Record<GameStatus, number> | null>(null);
  readonly recentEntries = signal<UserGame[]>([]);

  readonly backlogStatuses = [
    GameStatus.PLAYING,
    GameStatus.WANT_TO_PLAY_NEXT,
    GameStatus.WATCH_LIST,
    GameStatus.FINISHED,
    GameStatus.ABANDONED,
  ] as const;

  readonly statusLabels = GAME_STATUS_LABELS;

  ngOnInit(): void {
    this.gamesService.getPopular(12).subscribe({
      next: (res) => {
        this.popularGames.set(res.data);
        this.loadingPopular.set(false);
      },
      error: () => this.loadingPopular.set(false),
    });

    this.userGamesService.getCounts().subscribe((c) => this.counts.set(c));

    this.userGamesService.list({ page: 1, limit: 4 }).subscribe((res) => {
      this.recentEntries.set(res.data);
    });
  }
}
