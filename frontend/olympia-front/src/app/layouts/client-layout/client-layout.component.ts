import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router'; 
import { filter } from 'rxjs/operators'; 
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms'; // 👈 IMPORTANT POUR LA RECHERCHE
import { HttpClient } from '@angular/common/http'; // 👈 POUR APPELER LE BACKEND
import { environment } from '../../../environments/environment';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule, ImageUrlPipe ],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css'
})
export class ClientLayoutComponent implements OnInit {
  title = 'olympia';      

  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);

  currentUser: any = null;
  cartItemCount: number = 0;

  private http = inject(HttpClient);

  // 👇 VARIABLES POUR LA RECHERCHE 👇
  searchQuery: string = '';
  isSearching: boolean = false;
  searchResults: { produits: any[], boutiques: any[] } = { produits: [], boutiques: [] };
  showResultsPanel: boolean = false;

ngOnInit() {
    this.currentUser = this.authService.getUser();

    // Met à jour l'utilisateur si on navigue (Login/Logout)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentUser = this.authService.getUser();
    });

    // 👈 4. On s'abonne au "Haut-parleur" pour recevoir la quantité en temps réel !
    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  onLogout() {
    this.authService.logout(); 
    this.currentUser = null;   
  }

  isMobileMenuOpen: boolean = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
// ... suite du composant ...
  goToBoutique(boutiqueId: string) {
    this.closeSearch();
    // On redirige vers l'accueil en passant l'ID de la boutique dans l'URL (ex: /?boutique=123)
    this.router.navigate(['/'], { queryParams: { boutique: boutiqueId } });
  }
  goToProduit(produitId: string) {
    this.closeSearch(); // 1. On ferme le menu de recherche
    
    // 2. On force la navigation vers la page du produit
    this.router.navigate(['/produit-client', produitId]);
  }
  // Cette fonction s'exécute à chaque fois que l'utilisateur tape une lettre
  onSearchInput() {
    if (this.searchQuery.trim().length < 2) {
      this.showResultsPanel = false;
      this.searchResults = { produits: [], boutiques: [] };
      return;
    }

    this.isSearching = true;
    this.showResultsPanel = true;

    // On prépare nos deux requêtes (Produits et Boutiques)
    const urlProduits = `${environment.apiUrl}/produits`; // Adapte si tu as une route de recherche spécifique
    const urlBoutiques = `${environment.apiUrl}/boutiques/admin/all`; 

    // On utilise un petit "truc" pour attendre que les 2 requêtes finissent
    Promise.all([
      this.http.get<any[]>(urlProduits).toPromise(),
      this.http.get<any[]>(urlBoutiques).toPromise()
    ]).then(([produits, boutiques]) => {
      
      const queryLower = this.searchQuery.toLowerCase();

      // On filtre les produits (par nom ou catégorie)
      this.searchResults.produits = (produits || []).filter(p => 
        p.nom.toLowerCase().includes(queryLower) || 
        (p.id_categorie && p.id_categorie.nom.toLowerCase().includes(queryLower))
      ).slice(0, 5); // On limite à 5 résultats pour pas exploser le panneau

      // On filtre les boutiques
      this.searchResults.boutiques = (boutiques || []).filter(b => 
        b.nom.toLowerCase().includes(queryLower)
      ).slice(0, 3); // On limite à 3 résultats

      this.isSearching = false;
    }).catch(err => {
      console.error("Erreur recherche", err);
      this.isSearching = false;
    });
  }

  // Fermer le panneau quand on clique ailleurs ou sur un lien
  closeSearch() {
    this.showResultsPanel = false;
    this.searchQuery = '';
  }
}
  
  



