import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-boutique-store',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './boutique-store.component.html',
  styleUrls: ['./boutique-store.component.css']
})
export class BoutiqueStoreComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  
  shopData: any = null; // Contiendra { boutique, produits }
  isLoading = true;

  ngOnInit() {
    // 1. On récupère l'ID passé dans l'URL
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // 2. On appelle ton API existante : GET /api/boutiques/:id
      this.http.get<any>(`${environment.apiUrl}/boutiques/${id}`).subscribe({
        next: (response) => {
          this.shopData = response;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Erreur chargement vitrine", err);
          this.isLoading = false;
        }
      });
    }
  }
}