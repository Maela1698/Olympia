import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-boutique-creation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-boutique-creation.component.html',
  styleUrl: './admin-boutique-creation.component.css'
})
export class AdminBoutiqueCreationComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // --- VARIABLES D'ÉTAT ---
  isEditMode = false;
  currentBoutiqueId: string | null = null;

  // --- LISTES POUR LES SELECTS ---
  commerciaux: any[] = [];
  boxesLibres: any[] = [];
  categories: any[] = [];

  // --- MODÈLE DU FORMULAIRE ---
  formData = {
    nom: '',
    description: '',
    logo: '',
    horaires: '',
    id_responsable: '', 
    est_ouvert: false,
    id_box: '',         
    id_categorie: ''
  };

  ngOnInit() {
    this.loadListes();

    // 1. On regarde si l'URL contient un ID (ex: /admin/edit-boutique/65df...)
    this.currentBoutiqueId = this.route.snapshot.paramMap.get('id');
    
    // 2. Si oui, on active le mode Édition
    if (this.currentBoutiqueId) {
      this.isEditMode = true;
      this.loadBoutiqueData(this.currentBoutiqueId);
    }
  }

  // Charge les listes déroulantes
  loadListes() {
    this.http.get<any[]>(`${environment.apiUrl}/users/commercials`).subscribe(data => this.commerciaux = data);
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe(data => this.categories = data);
    
    // Pour les box, on ne prend que les libres (utile pour la création)
    this.http.get<any[]>(`${environment.apiUrl}/boxes`).subscribe(data => {
      this.boxesLibres = data.filter(b => !b.est_loue);
    });
  }

  // Remplit le formulaire en cas de modification
  loadBoutiqueData(id: string) {
    this.http.get<any>(`${environment.apiUrl}/boutiques/${id}`).subscribe({
      next: (data) => {
        const b = data.boutique; // L'API renvoie { boutique: ..., produits: ... }
        
        // On remplit le formulaire avec les données existantes
        // L'astuce (b.xxx?._id || b.xxx) sert à récupérer l'ID que ce soit peuplé (objet) ou non (string)
        this.formData = {
          nom: b.nom,
          description: b.description,
          logo: b.logo,
          horaires: b.horaires,
          est_ouvert: b.est_ouvert,
          id_categorie: b.id_categorie?._id || b.id_categorie,
          id_responsable: b.id_responsable?._id || b.id_responsable,
          id_box: b.id_box?._id || b.id_box
        };
      },
      error: (err) => console.error("Impossible de charger la boutique", err)
    });
  }

// Variable pour stocker le fichier
  selectedFile: File | null = null;

  // Détecter quand l'utilisateur choisit une image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    // 1. Création de l'objet FormData (Obligatoire pour envoyer des fichiers)
    const data = new FormData();
    
    // 2. Ajout des champs textes (Attention : FormData n'accepte que des string ou Blob)
    data.append('nom', this.formData.nom);
    data.append('description', this.formData.description || ''); // Gère le vide
    data.append('horaires', this.formData.horaires || '');
    data.append('id_responsable', this.formData.id_responsable);
    data.append('id_categorie', this.formData.id_categorie);
    data.append('est_ouvert', String(this.formData.est_ouvert)); // Convertit true/false en "true"/"false"

    // On n'ajoute id_box que si on n'est pas en mode édition (car il est verrouillé sinon)
    if (!this.isEditMode) {
        data.append('id_box', this.formData.id_box);
    }

    // 3. Ajout du fichier image (S'il y en a un nouveau)
    // Le nom 'image' ici doit correspondre à upload.single('image') dans ton Backend
    if (this.selectedFile) {
      data.append('image', this.selectedFile, this.selectedFile.name);
    } 
    // Si pas de fichier mais une URL texte (ex: ancienne image), on peut l'envoyer aussi
    else if (this.formData.logo) {
       data.append('logo', this.formData.logo);
    }

    // 4. Envoi au Backend
    if (this.isEditMode && this.currentBoutiqueId) {
      // --- MODE UPDATE (PUT) ---
      this.http.put(`${environment.apiUrl}/boutiques/${this.currentBoutiqueId}`, data)
        .subscribe({
          next: () => {
            alert("✅ Boutique modifiée avec succès (et image mise à jour) !");
            this.router.navigate(['/admin/dashboard']);
          },
          error: (err) => {
            console.error(err);
            alert("❌ Erreur modification : " + (err.error?.message || err.message));
          }
        });
    } else {
      // --- MODE CREATE (POST) ---
      this.http.post(`${environment.apiUrl}/boutiques`, data)
        .subscribe({
          next: () => {
            alert("✅ Boutique créée avec succès !");
            this.router.navigate(['/admin/dashboard']);
          },
          error: (err) => {
            console.error(err);
            alert("❌ Erreur création : " + (err.error?.message || err.message));
          }
        });
    }
  }
}