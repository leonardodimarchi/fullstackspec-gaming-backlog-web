import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GameStatus } from '../../shared/enums/game-status.enum';
import { Availability } from '../../shared/enums/availability.enum';
import { FinishedType } from '../../shared/enums/finished-type.enum';
import { PaginatedResponse } from '../../shared/models/paginated-response.model';
import { UserGame } from '../../shared/models/user-game.model';

export interface ListUserGamesQuery {
  page?: number;
  limit?: number;
  status?: GameStatus;
}

export interface CreateUserGameDto {
  igdbId: number;
}

export interface UpdateUserGameDto {
  status?: GameStatus;
  notes?: string;
  expectedTime?: number;
  expectedTimeForAllContent?: number;
  playedTime?: number;
  playedTimeForAllContent?: number;
  finishedType?: FinishedType;
  startDate?: string;
  endDate?: string;
  endDateForAllContent?: string;
  availability?: Availability;
}

@Injectable({ providedIn: 'root' })
export class UserGamesService {
  private readonly http = inject(HttpClient);

  getCounts() {
    return this.http.get<Record<GameStatus, number>>(
      `${environment.apiUrl}/user-games/counts`,
    );
  }

  list(query: ListUserGamesQuery = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PaginatedResponse<UserGame>>(
      `${environment.apiUrl}/user-games`,
      { params },
    );
  }

  getById(id: string) {
    return this.http.get<UserGame>(`${environment.apiUrl}/user-games/${id}`);
  }

  create(dto: CreateUserGameDto) {
    return this.http.post<UserGame>(`${environment.apiUrl}/user-games`, dto);
  }

  update(id: string, dto: UpdateUserGameDto) {
    return this.http.patch<UserGame>(`${environment.apiUrl}/user-games/${id}`, dto);
  }

  remove(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/user-games/${id}`);
  }
}
