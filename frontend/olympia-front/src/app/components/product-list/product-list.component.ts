import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BoutiqueService } from '../../services/boutique.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  // On ajoute le CSS ici pour aligner les flèches
  styles: [`
    .carousel-container { display: flex; align-items: center; justify-content: center; gap: 5px; }
    .btn-arrow { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
    .product-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
  `]
})
export class ProductListComponent implements OnInit {
  // --- INJECTIONS ---
  productService = inject(ProductService);
  boutiqueService = inject(BoutiqueService);
  authService = inject(AuthService);

  produits: any[] = [];

  ngOnInit() {
    this.loadProduits();
  }

  loadProduits() {
    const user = this.authService.getUser();
    
    // On vérifie que l'utilisateur est bien connecté
    if (user && user.id) {
      // 1. On récupère la boutique du user
      this.boutiqueService.getMaBoutique(user.id).subscribe({
        next: (res: any) => {
          const myBoutiqueId = res.boutique._id;
          
          // 2. On charge les produits filtrés par cette boutique
          this.productService.getAll(myBoutiqueId).subscribe(data => {
            // 👇 MODIFICATION ICI : On ajoute currentIndex: 0 à chaque produit
            this.produits = data.map((p: any) => ({
                ...p,
                currentIndex: 0 // Initialisation pour le carrousel
            }));
          });
        },
        error: (err) => console.error("Erreur boutique:", err)
      });
    }
  }

  // 👇 FONCTION SUIVANTE
  nextImage(produit: any) {
    if (produit.images && produit.images.length > 1) {
      if (produit.currentIndex < produit.images.length - 1) {
        produit.currentIndex++;
      } else {
        produit.currentIndex = 0; // Retour au début
      }
    }
  }

  // 👇 FONCTION PRÉCÉDENTE
  prevImage(produit: any) {
    if (produit.images && produit.images.length > 1) {
      if (produit.currentIndex > 0) {
        produit.currentIndex--;
      } else {
        produit.currentIndex = produit.images.length - 1; // Aller à la fin
      }
    }
  }

  deleteProduit(id: string) {
    if(confirm('Supprimer ce produit ?')) {
      this.productService.delete(id).subscribe(() => this.loadProduits());
    }
  }
}