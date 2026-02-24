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

  activeBoutiqueName: string = 'Chargement...';
  activeBoutiqueId: string = '';
  
  userBoutiques: any[] = []; // Toutes les boutiques de l'utilisateur connecté
  boutiquesStats: any[] = []; // Les statistiques séparées
  derniersProduits: any[] = [];

  ngOnInit() {
    const user = this.authService.getUser();
    
    // Sécurité : si aucun utilisateur n'est connecté, on bloque.
    if (!user || !user.id) {
      this.router.navigate(['/login']);
      return;
    }

    // 1. On récupère toutes les boutiques et on filtre pour CE vendeur
    this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`).subscribe(all => {
      this.userBoutiques = all.filter(b => b.id_responsable?._id === user.id || b.id_responsable === user.id);

      if (this.userBoutiques.length === 0) {
        this.activeBoutiqueName = 'Aucune boutique';
        return; // Le vendeur n'a pas encore de boutique
      }

      // 2. CORRECTION DU BUG LOCALSTORAGE : On vérifie si l'ID en mémoire appartient bien à ce vendeur
      const savedBoutiqueId = localStorage.getItem('activeBoutiqueId');
      const boutiqueValide = this.userBoutiques.find(b => b._id === savedBoutiqueId);

      if (boutiqueValide) {
        // La boutique en mémoire lui appartient bien
        this.activeBoutiqueId = boutiqueValide._id;
        this.activeBoutiqueName = boutiqueValide.nom;
      } else {
        // L'ID en mémoire appartient à l'ancien utilisateur ! On écrase avec SA première boutique.
        this.activeBoutiqueId = this.userBoutiques[0]._id;
        this.activeBoutiqueName = this.userBoutiques[0].nom;
        localStorage.setItem('activeBoutiqueId', this.activeBoutiqueId);
        localStorage.setItem('activeBoutiqueName', this.activeBoutiqueName);
      }

      // 3. Charger les stats pour CHAQUE boutique (pour les séparer)
      this.loadAllStats();

      // 4. Charger les derniers produits pour la liste rapide
      this.loadActiveBoutiqueProducts();
    });
  }

  loadAllStats() {
    this.boutiquesStats = []; // On vide le tableau
    
    // On boucle sur chaque boutique du vendeur pour récupérer ses propres produits
    this.userBoutiques.forEach(boutique => {
      this.productService.getAll(boutique._id).subscribe(produits => {
        this.boutiquesStats.push({
          nom: boutique.nom,
          nbProduits: produits.length,
          nbPromo: produits.filter(p => p.promo === true || p.promo === 'true').length
        });
      });
    });
  }

  loadActiveBoutiqueProducts() {
    this.productService.getAll(this.activeBoutiqueId).subscribe(produits => {
      this.derniersProduits = produits.slice().reverse().slice(0, 4); // Top 4 récents
    });
  }
}