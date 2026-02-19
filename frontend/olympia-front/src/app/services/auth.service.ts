import { Injectable, inject } from '@angular/core'; // inject est nouveau et pratique
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; // Assure-toi que ce fichier existe !

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // On utilise 'inject' ou le constructeur classique, ici le constructeur est plus simple pour débuter
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/auth`; // ex: http://localhost:3000/api/auth

  // Méthode de Connexion
  login(credentials: { mail: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Si la connexion réussit, on sauvegarde le token tout de suite
        // ✅ TRÈS IMPORTANT : Stocker le token pour l'intercepteur
      localStorage.setItem('token', response.token);
      // ✅ Stocker l'utilisateur pour connaître son ID et son rôle
      localStorage.setItem('user', JSON.stringify(response.user));
        if (response.token) {
          this.saveToken(response.token);
          this.saveUser(response.user); // Si ton backend renvoie aussi les infos user
        }
      })
    );
  }

  // Gestion du Token (Stockage local)
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Gestion de l'Utilisateur
  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}