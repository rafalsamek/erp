import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Import your AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Use inject to get AuthService instance
  const router = inject(Router);            // Use inject to get Router instance

  if (authService.isAuthenticated()) {  // Call the method isAuthenticated()
    return true;  // Allow access if the user is authenticated
  } else {
    // Directly call router.navigate() instead of using this.router
    router.navigate(['/']).then(
      () => {
        console.log('Navigation to home was successful');
      },
      (error) => {
        console.error('Navigation to home failed', error);
      }
    );
    return false;
  }
};
