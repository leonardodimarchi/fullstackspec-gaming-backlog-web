import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GameSortField } from '../../shared/enums/game-sort-field.enum';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { Game } from '../../shared/models/game.model';
import { MetadataItem } from '../../shared/models/metadata-item.model';
import { PaginatedResponse } from '../../shared/models/paginated-response.model';

export interface ListGamesQuery {
  page?: number;
  limit?: number;
  q?: string;
  sort?: GameSortField;
  sortOrder?: SortOrder;
  genreId?: number;
  platformId?: number;
  year?: number;
  minRating?: number;
}

@Injectable({ providedIn: 'root' })
export class GamesService {
  private readonly http = inject(HttpClient);

  getPopular(limit = 20) {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<{ data: Game[] }>(`${environment.apiUrl}/games/popular`, {
      params,
    });
  }

  list(query: ListGamesQuery = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PaginatedResponse<Game>>(`${environment.apiUrl}/games`, {
      params,
    });
  }

  getByIgdbId(igdbId: number) {
    return this.http.get<Game>(`${environment.apiUrl}/games/${igdbId}`);
  }

  getGenres(q?: string) {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    return this.http.get<MetadataItem[]>(`${environment.apiUrl}/games/metadata/genres`, {
      params,
    });
  }

  getPlatforms(q?: string) {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    return this.http.get<MetadataItem[]>(
      `${environment.apiUrl}/games/metadata/platforms`,
      { params },
    );
  }
}
