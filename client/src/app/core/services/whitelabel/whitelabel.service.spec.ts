// src/app/services/whitelabel/whitelabel.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { WhitelabelService } from './whitelabel.service';
import { IWhitelabel } from '../../types/types';
import {provideHttpClient} from '@angular/common/http';

describe('WhitelabelService', () => {
  let service: WhitelabelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WhitelabelService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(WhitelabelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load configuration and set whitelabelId', () => {
    const mockConfig: IWhitelabel = { whitelabelId: 'dummy-id' };

    // Subscribe to loadAppConfig to trigger the GET request.
    service.loadWhitelabel().subscribe({
      next: () => {
        expect(service.whitelabelId).toEqual('dummy-id');
      }
    });

    const req = httpMock.expectOne('/api/whitelabel');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);
  });

  it('should return null if configuration is not loaded', () => {
    expect(service.whitelabelId).toBeNull();
  });

  it('should log error on config load failure', () => {
    spyOn(console, 'error');
    service.loadWhitelabel().subscribe({
      error: () => {
        expect(console.error).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('/api/whitelabel');
    req.error(new ProgressEvent('Network error'));
  });
});
