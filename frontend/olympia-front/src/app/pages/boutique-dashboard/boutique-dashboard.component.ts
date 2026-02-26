import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-boutique-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageUrlPipe],
  templateUrl: './boutique-dashboard.component.html',
  styleUrls: ['./boutique-dashboard.component.css']
})
export class BoutiqueDashboardComponent implements OnInit {
  productService = inject(ProductService);
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  today: Date = new Date();

  // Nos nouvelles variables de données
  userBoutiques: any[] = []; 
  boutiquesData: any[] = []; // Contiendra TOUT (Produits, Stocks, Recette) séparé par boutique
  recetteGlobale: number = 0; // La somme de toutes les recettes de toutes les boutiques

  ngOnInit() {
    const user = this.authService.getUser();
    
    if (!user || (!user.id && !user._id)) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = user.id || user._id;

    // 1. On récupère toutes les boutiques du vendeur
    this.http.get<any[]>(`${environment.apiUrl}/boutiques/responsable/${userId}`).subscribe({
      next: (boutiques) => {
        this.userBoutiques = boutiques;
        this.loadBoutiquesData(); // On charge les détails
      },
      error: (err) => console.error("Erreur chargement boutiques", err)
    });
  }

  // 2. On charge les statistiques, les stocks et les recettes pour CHAQUE boutique
  loadBoutiquesData() {
    this.recetteGlobale = 0;
    this.boutiquesData = [];

    this.userBoutiques.forEach(boutique => {
      // On prépare un objet vide pour cette boutique
      let boutiqueDetail = {
        _id: boutique._id,
        nom: boutique.nom,
        produits: [] as any[],
        nbProduits: 0,
        nbPromo: 0,
        recette: 0
      };

      // A. On va chercher les produits (pour le stock)
      this.productService.getAll(boutique._id).subscribe(produits => {
        boutiqueDetail.produits = produits;
        boutiqueDetail.nbProduits = produits.length;
        boutiqueDetail.nbPromo = produits.filter((p: any) => p.promo === true || p.promo === 'true').length;
      });

      // B. On va chercher les commandes (pour la recette)
      this.http.get<any[]>(`${environment.apiUrl}/commandes/boutique/${boutique._id}`).subscribe(ventes => {
        // On additionne l'argent gagné
        const recetteBoutique = ventes.reduce((sum, v) => sum + v.total_gagne, 0);
        boutiqueDetail.recette = recetteBoutique;
        this.recetteGlobale += recetteBoutique; // On l'ajoute au grand total global
      });

      // On ajoute cette boutique configurée au tableau final
      this.boutiquesData.push(boutiqueDetail);
    });
  }
}