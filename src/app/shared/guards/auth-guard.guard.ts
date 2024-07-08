import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth$ = inject(AuthService);
  const router = inject(Router);
  if (auth$.isLoggedIn()) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};
