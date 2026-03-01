import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  cartItems: any[] = [];
  totalMontant: number = 0;
  isLoading: boolean = false;

  ngOnInit() {
    this.cartItems = this.cartService.getCart();
    this.totalMontant = this.cartItems.reduce((acc, item) => acc + (item.prix * item.quantite), 0);

    // Sécurité : si le panier est vide, on le renvoie à l'accueil
    if (this.cartItems.length === 0) {
      this.router.navigate(['/']);
    }
  }

  // LA FONCTION MAGIQUE QUI VALIDE L'ACHAT
  validerPaiement() {
    this.isLoading = true;
    const currentUser = this.authService.getUser();

    // 1. On formate les articles pour qu'ils correspondent exactement au modèle Node.js
    const articlesFormates = this.cartItems.map(item => ({
      id_produit: item.produitId,
      nom_produit: item.nom,
      id_boutique: item.boutiqueId,
      quantite: item.quantite,
      prix_unitaire: item.prix
    }));

    // 2. On prépare l'objet Commande final
    const commandeData = {
      id_client: currentUser.id || currentUser._id, // Assure-toi d'utiliser la bonne clé d'ID de ton user !
      articles: articlesFormates,
      montant_total: this.totalMontant
    };

    // 3. On envoie au backend !
    this.http.post(`${environment.apiUrl}/commandes`, commandeData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        // 🎉 ON GÉNÈRE LE PDF AVANT DE VIDER LE PANIER
        this.genererPDF(response.commandeId);

        alert("🎉 Paiement accepté ! Votre reçu a été téléchargé.");
        
        // On vide le panier après l'achat
        this.cartService.clearCart(); 
        
        // Redirection vers l'accueil
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert("❌ Une erreur est survenue lors du paiement.");
      }
    });
  }

  // 👇 LA FONCTION QUI DESSINE LE PDF
  genererPDF(numeroCommande: string) {
    const doc = new jsPDF();
    const currentUser = this.authService.getUser();
    const dateAchat = new Date().toLocaleDateString('fr-FR');

    // En-tête
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Couleur bleue de ton thème
    doc.text('OLYMPIA MALL', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Reçu de paiement officiel', 14, 30);
    doc.text(`Date : ${dateAchat}`, 14, 38);
    // On s'assure d'avoir un nom à afficher, sinon "Client" par défaut
    const clientName = currentUser.fname || currentUser.nom || currentUser.name || 'Client';
    doc.text(`Client : ${clientName}`, 14, 46);
    
    // Fallback : si numeroCommande n'est pas fourni, on met une chaîne vide
    doc.text(`N° de commande : ${numeroCommande || ''}`, 14, 54);

    // Préparation des données pour le tableau
    const tableData = this.cartItems.map(item => [
      item.nom,
      item.boutiqueNom,
      item.quantite.toString(),
      `${item.prix} Ar`,
      `${item.prix * item.quantite} Ar`
    ]);

    // Génération du tableau
    autoTable(doc, {
      startY: 65,
      head: [['Produit', 'Boutique', 'Qté', 'Prix U.', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] } // Couleur sombre de ton thème
    });

    // Le Total en bas
    const finalY = (doc as any).lastAutoTable.finalY || 65;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Montant Total Payé : ${this.totalMontant} Ar`, 14, finalY + 15);

    // Téléchargement automatique
    doc.save(`Recu_Olympia_${numeroCommande || 'Commande'}.pdf`);
  }
}