import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 1. IMPORT INDISPENSABLE

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // 👈 2. AJOUTER ICI
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  http = inject(HttpClient);
  
  // Données
  boxes: any[] = [];
  boutiques: any[] = [];

  // État du formulaire Box
  showBoxForm = false;
  isEditMode = false;
  currentBoxId: string | null = null;

  // Modèle du formulaire
  boxForm = {
    nom: '',
    etage: 0,
    surface: 10,
    est_loue: false
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les boxes
    this.http.get<any[]>(`${environment.apiUrl}/boxes`).subscribe(data => this.boxes = data);
    
    // Charger les boutiques
    this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`)
      .subscribe(data => this.boutiques = data);
  }

  // --- GESTION DES BOXES (CRUD) ---

  // 1. Ouvrir le formulaire pour CRÉER
  openCreateBox() {
    this.showBoxForm = true;
    this.isEditMode = false;
    this.boxForm = { nom: '', etage: 0, surface: 10, est_loue: false };
  }

  // 2. Ouvrir le formulaire pour MODIFIER
  openEditBox(box: any) {
    this.showBoxForm = true;
    this.isEditMode = true;
    this.currentBoxId = box._id;
    // On copie les données pour ne pas modifier le tableau directement
    this.boxForm = { 
        nom: box.nom, 
        etage: box.etage, 
        surface: box.surface, 
        est_loue: box.est_loue 
    };
  }

  // 3. ENREGISTRER (Create ou Update)
  saveBox() {
    if (this.isEditMode && this.currentBoxId) {
        // MODE UPDATE (PUT)
        this.http.put(`${environment.apiUrl}/boxes/${this.currentBoxId}`, this.boxForm)
            .subscribe({
                next: () => {
                    this.loadData(); // Rafraîchir la liste
                    this.showBoxForm = false; // Fermer le formulaire
                    this.currentBoxId = null;
                },
                error: (err) => alert("Erreur lors de la modification")
            });
    } else {
        // MODE CREATE (POST)
        this.http.post(`${environment.apiUrl}/boxes`, this.boxForm)
            .subscribe({
                next: () => {
                    this.loadData();
                    this.showBoxForm = false;
                },
                error: (err) => alert("Erreur : Ce nom de box existe peut-être déjà ?")
            });
    }
  }

  // 4. SUPPRIMER UN BOX
  deleteBox(box: any) {
    // Sécurité côté Front : on empêche le clic si loué
    if (box.est_loue) {
        alert("Impossible de supprimer : Ce box est actuellement loué !");
        return;
    }

    if(confirm(`Supprimer définitivement le box ${box.nom} ?`)) {
        this.http.delete(`${environment.apiUrl}/boxes/${box._id}`)
            .subscribe({
                next: () => {
                    this.loadData();
                },
                error: (err) => alert(err.error.message || "Impossible de supprimer")
            });
    }
  }

  // 5. ANNULER
  cancelBox() {
    this.showBoxForm = false;
    this.currentBoxId = null;
  }

  // --- GESTION DES BOUTIQUES ---

  deleteBoutique(id: string) {
    if(confirm("🛑 ATTENTION : Supprimer la boutique effacera tous ses produits et libérera le Box. Continuer ?")) {
      this.http.delete(`${environment.apiUrl}/boutiques/${id}`).subscribe({
        next: () => {
          alert("Suppression réussie !");
          this.loadData(); // On recharge pour voir le box redevenir vert
        },
        error: (err) => alert("Erreur lors de la suppression")
      });
    }
  }
}