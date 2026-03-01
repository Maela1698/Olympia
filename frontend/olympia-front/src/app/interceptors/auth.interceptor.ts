import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // 1. On récupère le token stocké spécifiquement dans cet onglet
  const token = sessionStorage.getItem('token'); 

  // 2. Si le token existe, on l'ajoute dans l'entête "Authorization"
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // 3. Sinon, on laisse passer la requête telle quelle (pour le login par exemple)
  return next(req);
};