import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  http = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/boxes`;

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(box: any) {
    return this.http.post(this.apiUrl, box);
  }

  update(id: string, box: any) {
    return this.http.put(`${this.apiUrl}/${id}`, box);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}