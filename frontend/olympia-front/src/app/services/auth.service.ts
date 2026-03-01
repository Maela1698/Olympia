import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Injection moderne et propre
  private http = inject(HttpClient);
  private router = inject(Router); 

  private apiUrl = `${environment.apiUrl}/auth`;

  // --- MÉTHODE DE CONNEXION ---
  login(credentials: { mail: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // On sauvegarde proprement une seule fois
        if (response.token && response.user) {
          this.saveToken(response.token);
          this.saveUser(response.user);
        }
      })
    );
  }

  // --- GESTION DU TOKEN (SESSION ISOLÉE PAR ONGLET) ---
  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // --- GESTION DE L'UTILISATEUR (SESSION ISOLÉE PAR ONGLET) ---
  saveUser(user: any): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // --- L'ARME ANTI-F12 (DÉCONNEXION) ---
  logout(): void {
    // 1. On détruit ABSOLUMENT TOUT le contenu du cache de CET onglet
    sessionStorage.clear(); 
    
    // 2. On renvoie l'utilisateur à la porte d'entrée
    this.router.navigate(['/login']);
  }
}