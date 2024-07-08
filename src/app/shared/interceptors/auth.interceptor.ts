import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth$ = inject(AuthService);
  if (!auth$.isLoggedIn()) return next(req);
  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${auth$.getToken()}`),
  });
  return next(reqWithHeader);
};
