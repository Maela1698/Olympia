import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // On récupère l'utilisateur connecté
  const user = authService.getUser();

  // SI l'utilisateur existe ET qu'il est admin -> On laisse passer
  if (user && user.role === 'admin') {
    return true; 
  }

  // SINON -> On le rejette vers le login ou l'accueil
  router.navigate(['/login']);
  return false;
};