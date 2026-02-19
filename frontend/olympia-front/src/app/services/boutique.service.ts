// src/app/services/boutique.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoutiqueService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/boutiques`;

  // Récupérer les infos (pour pré-remplir le formulaire)
  getMaBoutique(userId: string) {
    return this.http.get<any>(`${this.apiUrl}/mes-infos/${userId}`);
  }

  // Mettre à jour (FormData obligatoire pour l'image)
  update(id: string, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}