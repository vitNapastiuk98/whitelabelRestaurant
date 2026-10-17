import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../features/identity/data-access/auth.service';

export const whitelabelInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req).pipe(
    catchError(error => {
      if (error.status === 401 && token && !req.url.endsWith('/auth/login')) {
        auth.logout();
        void router.navigateByUrl('/admin/login');
      }
      return throwError(() => error);
    })
  );
};
