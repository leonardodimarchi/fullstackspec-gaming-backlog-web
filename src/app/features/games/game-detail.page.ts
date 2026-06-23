import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GamesService } from '../../core/services/games.service';
import { UserGamesService } from '../../core/services/user-games.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { Game } from '../../shared/models/game.model';

@Component({
  selector: 'app-game-detail-page',
  imports: [DecimalPipe, DatePipe, RouterLink, LoadingSpinnerComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner />
    } @else if (game(); as g) {
      <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div class="game-detail-cover card overflow-hidden">
          @if (g.coverUrl) {
            <img [src]="g.coverUrl" [alt]="g.name" class="game-detail-cover__img" />
          } @else {
            <div class="game-detail-cover__placeholder">Sem capa</div>
          }
        </div>

        <div>
          <h1 class="page-title">{{ g.name }}</h1>
          @if (g.releaseDate) {
            <p class="page-subtitle">Lançamento: {{ g.releaseDate | date: 'longDate' }}</p>
          }

          <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @if (g.rating !== undefined && g.rating !== null) {
              <div class="stat-chip">
                <span class="stat-chip__label">Nota IGDB</span>
                <span class="stat-chip__value">★ {{ g.rating | number: '1.0-0' }}/100</span>
              </div>
            }
            @if (g.expectedTime) {
              <div class="stat-chip">
                <span class="stat-chip__label">Tempo estimado (história)</span>
                <span class="stat-chip__value">~{{ g.expectedTime }}h</span>
              </div>
            }
            @if (g.expectedTimeForAllContent) {
              <div class="stat-chip">
                <span class="stat-chip__label">Tempo estimado (100%)</span>
                <span class="stat-chip__value">~{{ g.expectedTimeForAllContent }}h</span>
              </div>
            }
            @if (g.hypes) {
              <div class="stat-chip">
                <span class="stat-chip__label">Expectativa pré-lançamento</span>
                <span class="stat-chip__value">{{ g.hypes | number }} pessoas</span>
              </div>
            }
          </div>

          @if (g.genres.length) {
            <div class="mt-5">
              <h2 class="section-label">Gêneros</h2>
              <p class="mt-1">{{ g.genres.join(', ') }}</p>
            </div>
          }

          @if (g.platforms.length) {
            <div class="mt-4">
              <h2 class="section-label">Plataformas</h2>
              <p class="mt-1">{{ g.platforms.join(', ') }}</p>
            </div>
          }

          @if (g.summary) {
            <div class="mt-6">
              <h2 class="section-label">Sinopse</h2>
              <p class="mt-2 leading-relaxed text-text">{{ g.summary }}</p>
            </div>
          }

          <div class="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              class="btn-primary"
              [disabled]="inBacklog() || adding()"
              (click)="addToBacklog()"
            >
              @if (adding()) {
                Adicionando...
              } @else if (inBacklog()) {
                Adicionado ao backlog
              } @else {
                Adicionar ao backlog
              }
            </button>
            <a routerLink="/games" class="btn-ghost">Voltar ao catálogo</a>
          </div>

          @if (addError()) {
            <p class="mt-3 text-sm text-danger">{{ addError() }}</p>
          }
        </div>
      </div>
    }
  `,
})
export class GameDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gamesService = inject(GamesService);
  private readonly userGamesService = inject(UserGamesService);

  readonly loading = signal(true);
  readonly game = signal<Game | null>(null);
  readonly adding = signal(false);
  readonly inBacklog = signal(false);
  readonly addError = signal<string | null>(null);

  ngOnInit(): void {
    const igdbId = Number(this.route.snapshot.paramMap.get('igdbId'));
    this.gamesService.getByIgdbId(igdbId).subscribe({
      next: (game) => {
        this.game.set(game);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        void this.router.navigate(['/games']);
      },
    });
  }

  addToBacklog(): void {
    const g = this.game();
    if (!g || this.inBacklog()) return;

    this.adding.set(true);
    this.addError.set(null);

    this.userGamesService.create({ igdbId: g.igdbId }).subscribe({
      next: () => {
        this.inBacklog.set(true);
        this.adding.set(false);
      },
      error: (err) => {
        this.adding.set(false);
        if (err.status === 409) {
          this.inBacklog.set(true);
        } else {
          this.addError.set('Não foi possível adicionar ao backlog.');
        }
      },
    });
  }
}
