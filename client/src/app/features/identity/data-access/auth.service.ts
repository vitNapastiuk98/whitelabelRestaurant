import { Injectable, computed, signal } from '@angular/core';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
export interface AuthResponse { token: string; }
export interface IUser { username: string; isAuthenticated: boolean; token?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly empty: IUser = { username: '', isAuthenticated: false, token: undefined };
  private readonly state = signal<IUser>(this.restore());
  readonly user = this.state.asReadonly();
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  constructor(private http: HttpClient) {}
  private restore(): IUser {
    try {
      const value = JSON.parse(sessionStorage.getItem('restaurant-session') || 'null');
      const payload = JSON.parse(atob(value.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (typeof value.username === 'string' && payload.exp * 1000 > Date.now()) {
        return { username: value.username, token: value.token, isAuthenticated: true };
      }
    } catch {}
    return { username: '', isAuthenticated: false, token: undefined };
  }
  login(username: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password }).pipe(tap((response: AuthResponse) => {
      const value = { username, token: response.token, isAuthenticated: true };
      this.state.set(value);
      sessionStorage.setItem('restaurant-session', JSON.stringify(value));
    }));
  }
  logout() { this.state.set(this.empty); sessionStorage.removeItem('restaurant-session'); }
  getToken() { return this.state().token; }
}
