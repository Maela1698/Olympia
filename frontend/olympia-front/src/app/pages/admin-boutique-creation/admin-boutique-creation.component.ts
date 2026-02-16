import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-boutique-creation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-boutique-creation.component.html',
  styleUrl: './admin-boutique-creation.component.css' // Crée le fichier CSS
})
export class AdminBoutiqueCreationComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);

  // Listes pour les Selects
  commerciaux: any[] = [];
  boxesLibres: any[] = [];
  categories: any[] = [];

  // Données du formulaire
  formData = {
    nom: '',
    description: '',
    id_responsable: '',
    id_box: '',
    id_categorie: ''
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 1. Charger les commerciaux
    this.http.get<any[]>(`${environment.apiUrl}/users/commercials`).subscribe(data => this.commerciaux = data);

    // 2. Charger les Boxes (et filtrer ceux qui sont libres)
    this.http.get<any[]>(`${environment.apiUrl}/boxes`).subscribe(data => {
      this.boxesLibres = data.filter(b => !b.est_loue); // On ne veut que les libres
    });

    // 3. Charger les Catégories
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe(data => this.categories = data);
  }

  onSubmit() {
    console.log("Données envoyées :", this.formData);

    this.http.post(`${environment.apiUrl}/boutiques`, this.formData).subscribe({
      next: () => {
        alert("Boutique créée avec succès !");
        this.router.navigate(['/admin/dashboard']); // Retour au tableau de bord
      },
      error: (err) => {
        alert("Erreur : " + (err.error?.message || "Problème serveur"));
      }
    });
  }
}