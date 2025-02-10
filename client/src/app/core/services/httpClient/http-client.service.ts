import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  // Base URL for your API – adjust as needed or load from environment.
  private readonly API_URL = 'http://your-api-url.com/api';

  constructor(private http: HttpClient) { }

  // ---------- Menu Items Routes ----------
  getMenuItems(): Observable<any> {
    return this.http.get(`${this.API_URL}/menuItems`);
  }
  createMenuItem(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/menuItems`, payload);
  }
  updateMenuItem(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/menuItems/${id}`, payload);
  }
  deleteMenuItem(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/menuItems/${id}`);
  }

  // ---------- Menu Category Routes ----------
  getMenuCategories(): Observable<any> {
    return this.http.get(`${this.API_URL}/menuCategory`);
  }
  createMenuCategory(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/menuCategory`, payload);
  }
  updateMenuCategory(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/menuCategory/${id}`, payload);
  }
  deleteMenuCategory(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/menuCategory/${id}`);
  }

  // ---------- Events Routes ----------
  getEvents(): Observable<any> {
    return this.http.get(`${this.API_URL}/events`);
  }
  createEvent(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/events`, payload);
  }
  updateEvent(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/events/${id}`, payload);
  }
  deleteEvent(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/events/${id}`);
  }

  // ---------- Files Routes ----------
  getFiles(): Observable<any> {
    return this.http.get(`${this.API_URL}/files`);
  }
  createFile(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/files`, payload);
  }
  updateFile(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/files/${id}`, payload);
  }
  deleteFile(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/files/${id}`);
  }

  // ---------- Sections Routes ----------
  getSections(): Observable<any> {
    return this.http.get(`${this.API_URL}/sections`);
  }
  createSection(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/sections`, payload);
  }
  updateSection(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/sections/${id}`, payload);
  }
  deleteSection(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/sections/${id}`);
  }

  // ---------- Auth Routes ----------
  getAuth(): Observable<any> {
    return this.http.get(`${this.API_URL}/auth`);
  }
  createAuth(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth`, payload);
  }
  // Add dedicated login and register functions.
  loginAuth(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, payload);
  }
  registerAuth(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, payload);
  }
  updateAuth(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/auth/${id}`, payload);
  }
  deleteAuth(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/auth/${id}`);
  }

  // ---------- Posts Routes ----------
  getPosts(): Observable<any> {
    return this.http.get(`${this.API_URL}/posts`);
  }
  createPost(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/posts`, payload);
  }
  updatePost(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/posts/${id}`, payload);
  }
  deletePost(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URL}/posts/${id}`);
  }

  // ---------- Language Route ----------
  getLanguage(lang: string): Observable<any> {
    return this.http.get(`${this.API_URL}/language/${lang}`);
  }
}
