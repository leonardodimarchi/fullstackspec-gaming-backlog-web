import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../shared/enums/user-role.enum';
import { PaginatedResponse } from '../../shared/models/paginated-response.model';
import { User } from '../../shared/models/user.model';

export interface ListUsersQuery {
  page?: number;
  limit?: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  list(query: ListUsersQuery = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/users`, {
      params,
    });
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  create(dto: CreateUserDto) {
    return this.http.post<User>(`${environment.apiUrl}/users`, dto);
  }

  update(id: string, dto: UpdateUserDto) {
    return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, dto);
  }

  remove(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }
}
