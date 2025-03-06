import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

export const adminGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ?  true : router.createUrlTree(['/']);
};
