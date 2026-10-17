import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
describe('AuthService', () => {
  beforeEach(() => { sessionStorage.clear(); TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }); });
  afterEach(() => { TestBed.inject(HttpTestingController).verify(); sessionStorage.clear(); });
  it('starts unauthenticated', () => { expect(TestBed.inject(AuthService).isAuthenticated()).toBeFalse(); });
  it('logs in, persists the session and clears it on logout', () => {
    const service = TestBed.inject(AuthService);
    service.login('admin', 'secret').subscribe();
    TestBed.inject(HttpTestingController).expectOne('/api/auth/login').flush({ token: 'token' });
    expect(service.isAuthenticated()).toBeTrue(); expect(service.getToken()).toBe('token');
    expect(sessionStorage.getItem('restaurant-session')).toContain('admin');
    service.logout(); expect(service.isAuthenticated()).toBeFalse(); expect(sessionStorage.getItem('restaurant-session')).toBeNull();
  });
  it('restores an unexpired session and rejects an expired session', () => {
    const token = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })) + '.signature';
    sessionStorage.setItem('restaurant-session', JSON.stringify({ username: 'admin', token }));
    const service = TestBed.inject(AuthService);
    expect(service.isAuthenticated()).toBeTrue();
  });
  it('rejects an expired session', () => {
    sessionStorage.setItem('restaurant-session', JSON.stringify({ username: 'admin', token: 'h.' + btoa('{"exp":1}') + '.s' }));
    expect(TestBed.inject(AuthService).isAuthenticated()).toBeFalse();
  });
});
