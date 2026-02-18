import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Injection de dépendance moderne
  private http = inject(HttpClient);
  
  // URL vers ton backend (ex: http://localhost:3000/api/produits)
  private apiUrl = `${environment.apiUrl}/produits`;

  // 1. RÉCUPÉRER TOUS LES PRODUITS (Liste)
getAll(boutiqueId?: string) {
  // On ajoute le paramètre à l'URL
  const url = boutiqueId 
    ? `${this.apiUrl}?boutiqueId=${boutiqueId}` 
    : this.apiUrl;
    
  return this.http.get<any[]>(url);
}

  // 2. RÉCUPÉRER UN SEUL PRODUIT (Pour les détails ou l'édition)
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 3. CRÉER (IMPORTANT : On attend du FormData ici, pas du JSON !)
  create(productData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  // 4. MODIFIER (Idem, FormData car on peut modifier l'image)
  update(id: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  // 5. SUPPRIMER
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}