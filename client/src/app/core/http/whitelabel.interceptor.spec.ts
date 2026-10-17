import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../features/identity/data-access/auth.service';
import { whitelabelInterceptor } from './whitelabel.interceptor';
describe('API authentication interceptor', () => {
  beforeEach(() => { sessionStorage.clear(); TestBed.configureTestingModule({ providers: [provideRouter([]),
    provideHttpClient(withInterceptors([whitelabelInterceptor])), provideHttpClientTesting(),
    { provide: AuthService, useValue: { getToken: () => 'secret-token', logout: jasmine.createSpy('logout') } }
  ] }); });
  it('adds the bearer token only to the local API', () => {
    const client = TestBed.inject(HttpClient), http = TestBed.inject(HttpTestingController);
    client.get('/api/reservations').subscribe();
    const api = http.expectOne('/api/reservations'); expect(api.request.headers.get('Authorization')).toBe('Bearer secret-token'); api.flush([]);
    client.get('https://example.com/data').subscribe();
    const external = http.expectOne('https://example.com/data'); expect(external.request.headers.has('Authorization')).toBeFalse(); external.flush({});
    http.verify();
  });
});
