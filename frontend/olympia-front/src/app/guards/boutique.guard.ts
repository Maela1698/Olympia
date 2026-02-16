import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const boutiqueGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  // On vérifie strictement "commercial" comme dans votre BD
  if (user && user.role === 'commercial') {
    return true;
  }

  // Si c'est un Admin, on peut aussi décider de le laisser entrer (optionnel)
  if (user && user.role === 'admin') {
      return true;
  }

  // Sinon, dehors !
  router.navigate(['/login']);
  return false;
};