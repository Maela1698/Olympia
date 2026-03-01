import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router'; // 👈 1. IMPORT DE ActivatedRoute ICI
import { environment } from '../../../environments/environment';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageUrlPipe], 
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class HomeComponent implements OnInit { 
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute); // 👈 2. ON INJECTE LA ROUTE ICI

  boutiques: any[] = [];
  isLoading = true;

  // 👇 3. Nouvelle variable pour stocker la boutique sélectionnée via la recherche
  selectedBoutiqueId: string | null = null;

  ngOnInit() {
    // Étape A : On charge la liste normale des boutiques
    this.loadBoutiques();
    
    // Étape B : On écoute l'URL magique (?boutique=xyz)
    this.route.queryParams.subscribe(params => {
      if (params['boutique']) {
        // La recherche nous a envoyé ici !
        this.selectedBoutiqueId = params['boutique'];
        console.log("🎯 Filtrage demandé pour la boutique :", this.selectedBoutiqueId);
        
        // 💡 C'est ici que tu pourras appeler ta future fonction pour charger les produits !
        // Exemple : this.loadProduitsDeCetteBoutique(this.selectedBoutiqueId);
      } else {
        // Retour à la normale (Aucune recherche active)
        this.selectedBoutiqueId = null;
      }
    });
  }

  loadBoutiques() {
    this.http.get<any[]>(`${environment.apiUrl}/boutiques`).subscribe({
      next: (data) => {
        this.boutiques = data;
        this.isLoading = false;
        console.log("Boutiques reçues :", data);
      },
      error: (err) => {
        console.error("Erreur chargement boutiques", err);
        this.isLoading = false;
      }
    });
  }
}