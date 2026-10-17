import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { appConfig } from './app.config';
import { routes } from './app.routes';

describe('ApplicationConfig', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: appConfig.providers }));
  it('composes lazy routes and HTTP infrastructure', () => {
    expect(TestBed.inject(Router).config).toEqual(routes);
    expect(TestBed.inject(HttpClient)).toBeDefined();
  });
});
