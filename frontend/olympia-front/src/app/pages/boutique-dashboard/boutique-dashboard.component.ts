import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-boutique-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './boutique-dashboard.component.html',
  styleUrl: './boutique-dashboard.component.css'
})
export class BoutiqueDashboardComponent implements OnInit {
  productService = inject(ProductService);
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  today: Date = new Date();

  activeBoutiqueName: string = '';
  activeBoutiqueId: string | null = null;
  
  // Stats Réelles
  nbTotalBoutiques: number = 0;
  nbProduitsBoutique: number = 0;
  nbPromoBoutique: number = 0;
  derniersProduits: any[] = [];

  ngOnInit() {
    this.activeBoutiqueId = localStorage.getItem('activeBoutiqueId');
    this.activeBoutiqueName = localStorage.getItem('activeBoutiqueName') || 'Boutique';

    if (!this.activeBoutiqueId) {
      this.router.navigate(['/boutique/mes-boutiques']);
      return;
    }

    this.loadGlobalStats();
    this.loadBoutiqueData(this.activeBoutiqueId);
  }

  loadGlobalStats() {
    const user = this.authService.getUser();
    if (user?.id) {
      // On récupère toutes les boutiques pour compter celles du vendeur
      this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`).subscribe(all => {
        const sesBoutiques = all.filter(b => b.id_responsable?._id === user.id || b.id_responsable === user.id);
        this.nbTotalBoutiques = sesBoutiques.length;
      });
    }
  }

  loadBoutiqueData(id: string) {
    this.productService.getAll(id).subscribe(produits => {
      this.nbProduitsBoutique = produits.length;
      this.nbPromoBoutique = produits.filter(p => p.promo === true || p.promo === 'true').length;
      this.derniersProduits = produits.slice().reverse().slice(0, 4); // Top 4 récents
    });
  }
}