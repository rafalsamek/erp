import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Import your AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Use inject to get AuthService instance
  const router = inject(Router);            // Use inject to get Router instance

  if (authService.isAuthenticated()) {  // Call the method isAuthenticated()
    return true;  // Allow access if the user is authenticated
  } else {
    router.navigate(['/']);  // Redirect to home page if not authenticated
    return false;
  }
};
