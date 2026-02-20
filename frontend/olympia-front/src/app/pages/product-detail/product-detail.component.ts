import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  product: any = null;
  selectedImage: string = ''; // L'image affichée en grand

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<any>(`${environment.apiUrl}/produits/${id}`).subscribe({
        next: (data) => {
          this.product = data;
          // On initialise l'image principale avec la première du tableau
          if (this.product.images && this.product.images.length > 0) {
            this.selectedImage = this.product.images[0];
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  // Fonction pour changer l'image principale au clic
  changeImage(url: string) {
    this.selectedImage = url;
  }

  addToCart() {
    alert("Produit ajouté au panier (Simulation) !"); 
  }
}