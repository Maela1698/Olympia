import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  router = inject(Router);

  produits: any[] = [];
  activeBoutiqueName: string = '';

  ngOnInit() {
    const activeId = localStorage.getItem('activeBoutiqueId');
    this.activeBoutiqueName = localStorage.getItem('activeBoutiqueName') || 'ma boutique';

    if (!activeId) {
      // Sécurité : s'il n'a pas choisi de boutique, on le renvoie au Hub
      this.router.navigate(['/boutique/mes-boutiques']);
      return;
    }

    this.loadProduits(activeId);
  }

  loadProduits(boutiqueId: string) {
    this.productService.getAll(boutiqueId).subscribe(data => {
      this.produits = data.map((p: any) => ({ ...p, currentIndex: 0 }));
    });
  }

  nextImage(produit: any) {
    if (produit.images && produit.images.length > 1) {
      produit.currentIndex = (produit.currentIndex < produit.images.length - 1) ? produit.currentIndex + 1 : 0;
    }
  }

  prevImage(produit: any) {
    if (produit.images && produit.images.length > 1) {
      produit.currentIndex = (produit.currentIndex > 0) ? produit.currentIndex - 1 : produit.images.length - 1;
    }
  }

  deleteProduit(id: string) {
    if(confirm('🗑️ Supprimer définitivement ce produit ?')) {
      this.productService.delete(id).subscribe(() => {
        const activeId = localStorage.getItem('activeBoutiqueId');
        if(activeId) this.loadProduits(activeId);
      });
    }
  }
}