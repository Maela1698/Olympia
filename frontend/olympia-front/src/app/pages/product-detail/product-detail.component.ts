import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageUrlPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  product: any = null;
  selectedImage: string = '';
  quantiteChoisie: number = 1;

  ngOnInit() {
    // 💡 LA CORRECTION EST ICI : On "écoute" l'URL en permanence
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  // J'ai isolé l'appel HTTP ici pour que ce soit plus propre
  loadProduct(id: string) {
    this.http.get<any>(`${environment.apiUrl}/produits/${id}`).subscribe({
      next: (data) => {
        this.product = data;
        
        // On gère la première image
        if (this.product.images && this.product.images.length > 0) {
          this.selectedImage = this.product.images[0];
        } else {
          this.selectedImage = '';
        }

        // On réinitialise la quantité à 1 quand on charge un nouveau produit
        this.quantiteChoisie = 1; 
        
        // On remonte la page tout en haut pour le confort du client
        window.scrollTo(0, 0); 
      },
      error: (err) => console.error(err)
    });
  }

  changeImage(url: string) {
    this.selectedImage = url;
  }

  incrementQty() {
    if (this.quantiteChoisie < this.product.stock) this.quantiteChoisie++;
  }

  decrementQty() {
    if (this.quantiteChoisie > 1) this.quantiteChoisie--;
  }

  // --- LOGIQUE D'AJOUT AU PANIER ---
  addToCart() {
    const currentUser = this.authService.getUser(); 

    // 1. S'il n'est PAS connecté du tout
    if (!currentUser) {
      sessionStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return; 
    }

    // 2. S'il EST connecté MAIS n'est pas un client
    const role = currentUser.id_role?.nom || currentUser.role;
    if (role !== 'client') {
      alert("⚠️ Action refusée : Vous naviguez en tant que professionnel. Seuls les clients peuvent commander.");
      return;
    }

    // 3. Si tout est bon, on prépare l'objet
    const itemPanier = {
      produitId: this.product._id,
      nom: this.product.nom,
      prix: this.product.prix,
      quantite: this.quantiteChoisie, 
      image: this.selectedImage,
      boutiqueId: this.product.id_boutique._id,
      boutiqueNom: this.product.id_boutique.nom
    };

    // 4. ON ENVOIE AU SERVICE PANIER
    this.cartService.addToCart(itemPanier);
    
    // 5. On confirme au client
    alert(`🎉 Super ! Vous avez ajouté ${this.quantiteChoisie}x ${this.product.nom} au panier !`);
  } 
}