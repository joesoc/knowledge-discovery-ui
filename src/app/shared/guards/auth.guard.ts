import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = inject(LoginService).isAuthenticated;

  if (!isAuthenticated) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
