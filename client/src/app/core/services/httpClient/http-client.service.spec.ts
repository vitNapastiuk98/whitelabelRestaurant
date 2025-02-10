import { TestBed } from '@angular/core/testing';
import { HttpClientService } from './http-client.service';
import { HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://your-api-url.com/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [HttpClientService,
        provideHttpClient(),
        provideHttpClientTesting()]
    });
    service = TestBed.inject(HttpClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ---------- Menu Items Tests ----------
  describe('Menu Items Routes', () => {
    it('should get menu items', () => {
      const dummyData = [{ id: 1, name: 'Pizza' }];
      service.getMenuItems().subscribe(data => {
        expect(data).toEqual(dummyData);
      });
      const req = httpMock.expectOne(`${API_URL}/menuItems`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });

    it('should create a menu item', () => {
      const payload = { name: 'Burger' };
      const responsePayload = { id: 2, name: 'Burger' };
      service.createMenuItem(payload).subscribe(data => {
        expect(data).toEqual(responsePayload);
      });
      const req = httpMock.expectOne(`${API_URL}/menuItems`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(responsePayload);
    });

    it('should update a menu item', () => {
      const id = 1;
      const payload = { name: 'Updated Pizza' };
      service.updateMenuItem(id, payload).subscribe(data => {
        expect(data).toEqual(payload);
      });
      const req = httpMock.expectOne(`${API_URL}/menuItems/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(payload);
    });

    it('should delete a menu item', () => {
      const id = 1;
      service.deleteMenuItem(id).subscribe(data => {
        expect(data).toEqual({});
      });
      const req = httpMock.expectOne(`${API_URL}/menuItems/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  // ---------- Posts Tests (as an additional example) ----------
  describe('Posts Routes', () => {
    it('should get posts', () => {
      const dummyPosts = [{ id: 1, title: 'Post 1' }];
      service.getPosts().subscribe(posts => {
        expect(posts).toEqual(dummyPosts);
      });
      const req = httpMock.expectOne(`${API_URL}/posts`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyPosts);
    });

    it('should create a post', () => {
      const payload = { title: 'New Post', content: 'Content here' };
      const responsePayload = { id: 10, title: 'New Post', content: 'Content here' };
      service.createPost(payload).subscribe(post => {
        expect(post).toEqual(responsePayload);
      });
      const req = httpMock.expectOne(`${API_URL}/posts`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(responsePayload);
    });

    it('should update a post', () => {
      const id = 10;
      const payload = { title: 'Updated Post', content: 'Updated content' };
      service.updatePost(id, payload).subscribe(post => {
        expect(post).toEqual(payload);
      });
      const req = httpMock.expectOne(`${API_URL}/posts/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(payload);
    });

    it('should delete a post', () => {
      const id = 10;
      service.deletePost(id).subscribe(post => {
        expect(post).toEqual({});
      });
      const req = httpMock.expectOne(`${API_URL}/posts/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });


  // ---------- Auth Routes Tests ----------
  describe('Auth Routes', () => {
    it('should login via loginAuth', () => {
      const payload = { username: 'testuser', password: 'password123' };
      const dummyToken = 'jwt-token';
      service.loginAuth(payload).subscribe(response => {
        expect(response).toEqual({ token: dummyToken });
      });
      const req = httpMock.expectOne(`${API_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ token: dummyToken });
    });

    it('should register via registerAuth', () => {
      const payload = { username: 'newuser', password: 'newpassword' };
      const dummyToken = 'jwt-token-register';
      service.registerAuth(payload).subscribe(response => {
        expect(response).toEqual({ token: dummyToken });
      });
      const req = httpMock.expectOne(`${API_URL}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ token: dummyToken });
    });
  });

  // Test for Language Route
  describe('Language Route', () => {
    it('should get language JSON for a supported language', () => {
      const lang = 'italian';
      const dummyStrings = { welcome: 'Benvenuto' };
      service.getLanguage(lang).subscribe(strings => {
        expect(strings).toEqual(dummyStrings);
      });
      const req = httpMock.expectOne(`${API_URL}/language/${lang}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyStrings);
    });
  });
});
