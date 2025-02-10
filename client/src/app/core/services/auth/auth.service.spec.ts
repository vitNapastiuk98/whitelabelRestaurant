import { TestBed } from '@angular/core/testing';
import { AuthService, AuthResponse, IUser } from './auth.service';
import { HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HttpClientService} from '../httpClient/http-client.service';
import {provideHttpClient} from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let httpService: HttpClientService;
  const API_URL = 'http://your-api-url.com/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, HttpClientService, provideHttpClientTesting(), provideHttpClient(),
        provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpService = TestBed.inject(HttpClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should have an initial unauthenticated state', () => {
    const initialUser: IUser = { isAuthenticated: false, username: '', token: undefined };
    expect(service.user()).toEqual(initialUser);
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getToken()).toBeUndefined();
  });

  it('should login successfully and update user state', () => {
    const username = 'testuser';
    const password = 'password123';
    const dummyToken = 'jwt-token-login';

    service.login(username, password).subscribe((response: AuthResponse) => {
      expect(response.token).toEqual(dummyToken);
    });

    const req = httpMock.expectOne(`${API_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username, password });
    req.flush({ token: dummyToken });

    const updatedUser = service.user();
    expect(updatedUser.isAuthenticated).toBeTrue();
    expect(updatedUser.username).toEqual(username);
    expect(updatedUser.token).toEqual(dummyToken);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getToken()).toEqual(dummyToken);
  });

  it('should register successfully and update user state', () => {
    const username = 'newuser';
    const password = 'newpassword';
    const dummyToken = 'jwt-token-register';

    service.register(username, password).subscribe((response: AuthResponse) => {
      expect(response.token).toEqual(dummyToken);
    });

    const req = httpMock.expectOne(`${API_URL}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username, password });
    req.flush({ token: dummyToken });

    const updatedUser = service.user();
    expect(updatedUser.isAuthenticated).toBeTrue();
    expect(updatedUser.username).toEqual(username);
    expect(updatedUser.token).toEqual(dummyToken);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getToken()).toEqual(dummyToken);
  });

  it('should logout and reset user state', () => {
    // Simulate a login first.
    service.login('testuser', 'password123').subscribe();
    const req = httpMock.expectOne(`${API_URL}/auth/login`);
    req.flush({ token: 'dummy-token' });

    // Now logout.
    service.logout();
    const userState = service.user();
    expect(userState.isAuthenticated).toBeFalse();
    expect(userState.username).toEqual('');
    expect(userState.token).toBeUndefined();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getToken()).toBeUndefined();
  });
});
