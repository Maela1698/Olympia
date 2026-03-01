import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // 👈 Important pour le ngModel (menu déroulant)
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-boutique-ventes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutique-ventes.component.html',
  styleUrls: ['./boutique-ventes.component.css']
})
export class BoutiqueVentesComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  mesBoutiques: any[] = [];
  boutiqueSelectionnee: string = ''; // L'ID de la boutique choisie dans le menu
  historiqueVentes: any[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.chargerMesBoutiques();
  }

  // 1. On charge la liste des boutiques du vendeur connecté
  chargerMesBoutiques() {
    const currentUser = this.authService.getUser();
    const vendeurId = currentUser.id || currentUser._id;

    this.http.get<any[]>(`${environment.apiUrl}/boutiques/responsable/${vendeurId}`).subscribe({
      next: (boutiques) => {
        this.mesBoutiques = boutiques;
        
        // Si le vendeur a au moins une boutique, on sélectionne la première par défaut et on charge ses ventes
        if (this.mesBoutiques.length > 0) {
          this.boutiqueSelectionnee = this.mesBoutiques[0]._id;
          this.chargerVentes();
        }
      },
      error: (err) => console.error("Erreur chargement boutiques", err)
    });
  }

  // 2. On charge les ventes de la boutique sélectionnée
  // 2. On charge les ventes de la boutique sélectionnée
  chargerVentes() {
    // 🚨 MOUCHARD 1 : Vérifier l'ID de la boutique sélectionnée
    console.log("1. ID de la boutique cherchée :", this.boutiqueSelectionnee);

    if (!this.boutiqueSelectionnee) {
      console.error("❌ ERREUR : L'ID de la boutique est vide ou undefined !");
      return;
    }

    this.isLoading = true;
    const url = `${environment.apiUrl}/commandes/boutique/${this.boutiqueSelectionnee}`;
    console.log("2. URL interrogée par Angular :", url);

    this.http.get<any[]>(url).subscribe({
      next: (ventes) => {
        // 🚨 MOUCHARD 2 : Voir ce que le serveur répond
        console.log("3. Réponse du serveur Node.js :", ventes);
        this.historiqueVentes = ventes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("❌ Erreur chargement ventes", err);
        this.isLoading = false;
      }
    });
  }

  // Fonction appelée quand on change de boutique dans le menu déroulant
  onChangementBoutique() {
    this.chargerVentes();
  }
}