import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../shared/models/auth-response.model';
import { User } from '../../shared/models/user.model';
import { UserRole } from '../../shared/enums/user-role.enum';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'currentUser';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === UserRole.ADMIN);

  constructor() {
    this.loadSession();
  }

  loadSession(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = this.loadUserFromStorage();
    if (token && user) {
      this._currentUser.set(user);
    } else {
      this.clearStorage();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, dto).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  logout(): void {
    this.clearStorage();
    this._currentUser.set(null);
    void this.router.navigate(['/login']);
  }

  handleUnauthorized(): void {
    this.clearStorage();
    this._currentUser.set(null);
    void this.router.navigate(['/login']);
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this._currentUser.set(response.user);
  }

  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
