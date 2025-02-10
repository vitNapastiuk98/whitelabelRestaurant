import { Injectable, computed, Signal, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {HttpClientService} from '../httpClient/http-client.service';

export interface AuthResponse {
  token: string;
  // add additional properties as needed
}

export interface IUser {
  username: string;
  isAuthenticated: boolean;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Private writable signal for authentication state.
  private user$: WritableSignal<IUser> = signal({
    isAuthenticated: false,
    username: '',
    token: undefined,
  });

  // Public read-only signal.
  user: Signal<IUser> = this.user$.asReadonly();

  // Computed signal for authentication status.
  isAuthenticated: Signal<boolean> = computed(() => this.user$().isAuthenticated);

  constructor(private httpService: HttpClientService) { }

  /**
   * Login: calls the /auth/login endpoint via httpClientService.
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.httpService.loginAuth({ username, password }).pipe(
      tap((response: AuthResponse) => {
        this.user$.set({
          username,
          isAuthenticated: true,
          token: response.token,
        });
      })
    );
  }

  /**
   * Register: calls the /auth/register endpoint via httpClientService.
   */
  register(username: string, password: string): Observable<AuthResponse> {
    return this.httpService.registerAuth({ username, password }).pipe(
      tap((response: AuthResponse) => {
        this.user$.set({
          username,
          isAuthenticated: true,
          token: response.token,
        });
      })
    );
  }

  /**
   * Logout: Clears the authentication state.
   */
  logout(): void {
    this.user$.set({
      username: '',
      isAuthenticated: false,
      token: undefined,
    });
  }

  /**
   * Returns the current token.
   */
  getToken(): string | undefined {
    return this.user$().token;
  }
}
