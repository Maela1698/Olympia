import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; //

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'olympia_cart';

  // 1. Le "Haut-parleur" qui annonce le nombre total d'articles (initialisé au démarrage)
  private cartCountSource = new BehaviorSubject<number>(this.getInitialCount());
  // Le flux que le Header va écouter :
  cartCount$ = this.cartCountSource.asObservable(); 

  constructor() {}

  // Calcule combien d'articles sont déjà dans le localStorage au chargement de la page
  private getInitialCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantite, 0); // Additionne toutes les quantités
  }

  // Récupérer tout le panier
  getCart(): any[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Ajouter un produit au panier
  addToCart(item: any) {
    let cart = this.getCart();
    const existingItem = cart.find((i: any) => i.produitId === item.produitId);

    if (existingItem) {
      existingItem.quantite += item.quantite;
    } else {
      cart.push(item);
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));

    // 2.  ON MET À JOUR LE HAUT-PARLEUR APRÈS L'AJOUT !
    const totalItems = cart.reduce((total, i) => total + i.quantite, 0);
    this.cartCountSource.next(totalItems); // Diffuse le nouveau nombre à toute l'application
  }

  // Vider le panier
  clearCart() {
    localStorage.removeItem(this.cartKey);
    this.cartCountSource.next(0); // On annonce que le panier est vide
  }
  // 4. Supprimer un seul produit du panier
  removeProduct(produitId: string) {
    let cart = this.getCart();
    
    // On garde tous les produits SAUF celui qu'on veut supprimer
    cart = cart.filter((item: any) => item.produitId !== produitId);
    
    // On sauvegarde le nouveau panier
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    
    // On met à jour la pastille rouge
    const totalItems = cart.reduce((total, i) => total + i.quantite, 0);
    this.cartCountSource.next(totalItems);
  }
}