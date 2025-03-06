import {CanActivateChildFn, provideRouter} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {guestGuard} from './guest.guard';

describe('guestGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
