// src/app/core/interceptors/whitelabel/whitelabel.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { whitelabelInterceptor } from './whitelabel.interceptor';
import { WhitelabelService } from '../../services/whitelabel/whitelabel.service';
import { Injector, runInInjectionContext } from '@angular/core';

describe('whitelabelInterceptor (functional)', () => {
  let fakeService: Partial<WhitelabelService>;

  beforeEach(() => {
    // Create a fake service with a default whitelabelId.
    fakeService = { whitelabelId: 'test-id' };
    // Override the provider so that Angular’s inject() returns our fake.
    TestBed.overrideProvider(WhitelabelService, { useValue: fakeService });
  });

  it('should add X-Whitelabel-Id header when whitelabelId exists', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const next = (modifiedReq: HttpRequest<any>) => {
      expect(modifiedReq.headers.get('X-Whitelabel-Id')).toEqual('test-id');
      done();
      return null;
    };

    // Wrap the interceptor call inside an injection context.
    runInInjectionContext(TestBed.inject(Injector), () => {
      whitelabelInterceptor(req, next as any);
    });
  });

  it('should not modify the request when whitelabelId is null', (done) => {
    (fakeService as any).whitelabelId = null; // Simulate no configuration loaded.
    const req = new HttpRequest('GET', '/api/test');
    const next = (modifiedReq: HttpRequest<any>) => {
      expect(modifiedReq.headers.has('X-Whitelabel-Id')).toBeFalse();
      done();
      return null;
    };

    runInInjectionContext(TestBed.inject(Injector),() => {
      whitelabelInterceptor(req, next as any);
    });
  });
});
