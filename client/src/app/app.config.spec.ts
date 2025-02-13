// src/app/app.config.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { appConfig } from './app.config';
import { routes } from './app.routes';


describe('appConfig', () => {
  it('should export a valid ApplicationConfig with a providers array', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBeTrue();
  });

  it('should include exactly 4 providers', () => {
    expect(appConfig.providers.length).toBe(4);
  });
});

describe('appConfig Providers Integration', () => {
  beforeEach(() => {
    // Configure the testing module with the providers from appConfig.
    TestBed.configureTestingModule({
      providers: [...appConfig.providers]
    });
  });

  it('should allow injection of Router (provided via provideRouter)', () => {
    const router = TestBed.inject(Router);
    expect(router).toBeDefined();
    // Optionally, verify that the router is configured with the expected routes.
    // (This depends on your app.routes setup and may require additional checks.)
    expect(router.config).toEqual(routes);
  });

  it('should allow injection of HttpClient (provided via provideHttpClient)', () => {
    const http = TestBed.inject(HttpClient);
    expect(http).toBeDefined();
  });



  // While provideZoneChangeDetection sets up Angular’s internal change detection,
  // its effects are not directly injectable. The fact that the module bootstraps
  // without error is a good indication that it is configured correctly.
});
