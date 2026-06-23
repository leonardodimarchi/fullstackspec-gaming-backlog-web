import { Component, inject, OnInit, signal } from '@angular/core';
import { GamesService } from '../../core/services/games.service';
import { GameSortField } from '../../shared/enums/game-sort-field.enum';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import {
  GameFiltersComponent,
  GameFiltersValue,
} from '../../shared/components/game-filters.component';
import { GameGridComponent } from '../../shared/components/game-grid.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { Game } from '../../shared/models/game.model';
import { MetadataItem } from '../../shared/models/metadata-item.model';

@Component({
  selector: 'app-games-catalog-page',
  imports: [
    GameFiltersComponent,
    GameGridComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
  ],
  template: `
    <div>
      <h1 class="page-title">Catálogo de jogos</h1>
      <p class="page-subtitle mb-6">Busque e filtre jogos do IGDB.</p>

      <app-game-filters
        class="mb-6 block"
        [genres]="genres()"
        [platforms]="platforms()"
        [initial]="filters"
        (filtersChange)="onFiltersChange($event)"
      />

      @if (loading()) {
        <app-loading-spinner />
      } @else if (games().length === 0) {
        <p class="py-12 text-center text-text-muted">Nenhum jogo encontrado com esses filtros.</p>
      } @else {
        <app-game-grid [games]="games()" />
        <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="onPageChange($event)" />
      }
    </div>
  `,
})
export class GamesCatalogPage implements OnInit {
  private readonly gamesService = inject(GamesService);

  readonly loading = signal(true);
  readonly games = signal<Game[]>([]);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly genres = signal<MetadataItem[]>([]);
  readonly platforms = signal<MetadataItem[]>([]);

  filters: GameFiltersValue = {
    q: '',
    sort: GameSortField.POPULARITY,
    sortOrder: SortOrder.DESC,
    genreId: null,
    platformId: null,
    year: null,
    minRating: null,
  };

  ngOnInit(): void {
    this.gamesService.getGenres().subscribe((g) => this.genres.set(g));
    this.gamesService.getPlatforms().subscribe((p) => this.platforms.set(p));
    this.loadGames();
  }

  onFiltersChange(filters: GameFiltersValue): void {
    this.filters = filters;
    this.page.set(1);
    this.loadGames();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadGames();
  }

  private loadGames(): void {
    this.loading.set(true);
    const hasTextSearch = !!this.filters.q.trim();

    this.gamesService
      .list({
        page: this.page(),
        limit: 24,
        q: hasTextSearch ? this.filters.q.trim() : undefined,
        sort: hasTextSearch ? undefined : this.filters.sort,
        sortOrder: hasTextSearch ? undefined : this.filters.sortOrder,
        genreId: this.filters.genreId ?? undefined,
        platformId: this.filters.platformId ?? undefined,
        year: this.filters.year ?? undefined,
        minRating: this.filters.minRating ?? undefined,
      })
      .subscribe({
        next: (res) => {
          this.games.set(res.data);
          this.totalPages.set(res.meta.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
