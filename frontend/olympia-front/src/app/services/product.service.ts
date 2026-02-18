import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/produits`;

  create(productData: any) {
    return this.http.post(this.apiUrl, productData);
  }

  update(id: string, productData: any) {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}