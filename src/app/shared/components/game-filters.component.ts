import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSortField } from '../enums/game-sort-field.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { GAME_SORT_FIELDS, GAME_SORT_LABELS } from '../constants/labels';
import { MetadataItem } from '../models/metadata-item.model';
import { SearchableSelectComponent } from './searchable-select.component';

export interface GameFiltersValue {
  q: string;
  sort: GameSortField;
  sortOrder: SortOrder;
  genreId: number | null;
  platformId: number | null;
  year: number | null;
  minRating: number | null;
}

@Component({
  selector: 'app-game-filters',
  imports: [FormsModule, SearchableSelectComponent],
  template: `
    <form class="card grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4" (ngSubmit)="onSubmit()">
      <div class="lg:col-span-2">
        <label class="label" for="q">Buscar</label>
        <input id="q" class="input" [(ngModel)]="filters.q" name="q" placeholder="Nome do jogo..." />
      </div>

      <div>
        <label class="label" for="sort">Ordenar por</label>
        <select
          id="sort"
          class="select"
          [(ngModel)]="filters.sort"
          name="sort"
          [disabled]="!!filters.q.trim()"
          [class.input--disabled]="!!filters.q.trim()"
        >
          @for (field of sortFields; track field) {
            <option [value]="field">{{ sortLabels[field] }}</option>
          }
        </select>
      </div>

      <div>
        <label class="label" for="sortOrder">Ordem</label>
        <select
          id="sortOrder"
          class="select"
          [(ngModel)]="filters.sortOrder"
          name="sortOrder"
          [disabled]="!!filters.q.trim()"
          [class.input--disabled]="!!filters.q.trim()"
        >
          <option [value]="SortOrder.DESC">Decrescente</option>
          <option [value]="SortOrder.ASC">Crescente</option>
        </select>
      </div>

      <div>
        <label class="label" for="genre">Gênero</label>
        <app-searchable-select
          inputId="genre"
          placeholder="Buscar gênero..."
          emptyLabel="Todos os gêneros"
          [items]="genres()"
          [value]="filters.genreId"
          (valueChange)="filters.genreId = $event"
        />
      </div>

      <div>
        <label class="label" for="platform">Plataforma</label>
        <app-searchable-select
          inputId="platform"
          placeholder="Buscar plataforma..."
          emptyLabel="Todas as plataformas"
          [items]="platforms()"
          [value]="filters.platformId"
          (valueChange)="filters.platformId = $event"
        />
      </div>

      <div>
        <label class="label" for="year">Ano</label>
        <input id="year" class="input" type="number" [(ngModel)]="filters.year" name="year" placeholder="Ex: 2024" />
      </div>

      <div>
        <label class="label" for="minRating">Rating mínimo</label>
        <input
          id="minRating"
          class="input"
          type="number"
          min="0"
          max="100"
          [(ngModel)]="filters.minRating"
          name="minRating"
          placeholder="0-100"
        />
      </div>

      <div class="flex items-end gap-2 lg:col-span-4">
        <button type="submit" class="btn-primary">Filtrar</button>
        <button type="button" class="btn-ghost" (click)="onReset()">Limpar</button>
      </div>
    </form>
  `,
})
export class GameFiltersComponent implements OnInit {
  readonly genres = input<MetadataItem[]>([]);
  readonly platforms = input<MetadataItem[]>([]);
  readonly initial = input<Partial<GameFiltersValue>>({});
  readonly filtersChange = output<GameFiltersValue>();

  readonly SortOrder = SortOrder;
  readonly sortFields = GAME_SORT_FIELDS;
  readonly sortLabels = GAME_SORT_LABELS;

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
    Object.assign(this.filters, this.initial());
  }

  onSubmit(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  onReset(): void {
    this.filters = {
      q: '',
      sort: GameSortField.POPULARITY,
      sortOrder: SortOrder.DESC,
      genreId: null,
      platformId: null,
      year: null,
      minRating: null,
    };
    this.filtersChange.emit({ ...this.filters });
  }
}
