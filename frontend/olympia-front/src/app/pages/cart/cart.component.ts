import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe'; // Ton pipe pour les images

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageUrlPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  
  cartItems: any[] = [];
  totalMontant: number = 0;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
  }

  calculateTotal() {
    // Calcule (Prix * Quantité) pour chaque article et additionne le tout
    this.totalMontant = this.cartItems.reduce((acc, item) => acc + (item.prix * item.quantite), 0);
  }

  removeItem(produitId: string) {
    if(confirm("Retirer cet article du panier ?")) {
      this.cartService.removeProduct(produitId);
      this.loadCart(); // On recharge l'affichage après suppression
    }
  }

  clearAll() {
    if(confirm("Voulez-vous vraiment vider tout votre panier ?")) {
      this.cartService.clearCart();
      this.loadCart();
    }
  }
}