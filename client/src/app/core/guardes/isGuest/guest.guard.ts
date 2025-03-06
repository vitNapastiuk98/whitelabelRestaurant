import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

export const guestGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ?   router.createUrlTree(['/admin/content']) : true;
};


