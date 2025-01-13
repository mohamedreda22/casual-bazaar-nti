import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth.service.service';
import { Observable, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const _authS = inject(AuthServiceService);
  const _router = inject(Router);

  // Check if user is authenticated and is an admin
  return _authS.isAuthenticated().pipe(
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        _router.navigate(['/login']); // Redirect to login if not authenticated
        return [false];
      }
      return _authS.isAdmin().pipe(
        switchMap((isAdmin) => {
          if (isAdmin) {
            return [true]; // Allow access if the user is an admin
          } else {
            _router.navigate(['/home']); // Redirect non-admins to home
            return [false];
          }
        })
      );
    })
  );
};
