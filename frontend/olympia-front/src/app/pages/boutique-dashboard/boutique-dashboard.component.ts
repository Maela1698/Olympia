import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-boutique-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutique-dashboard.component.html',
  styleUrl: './boutique-dashboard.component.css'
})
export class BoutiqueDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  maBoutique: any = null;
  mesProduits: any[] = [];
  messageErreur: string = '';
  
  // Objet unique pour le formulaire (Sert à l'Ajout ET à la Modif)
  productForm = { _id: '', nom: '', prix: 0, description: '' };
  isEditMode = false;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    const user = this.authService.getUser();
    if (user?.id) {
      this.http.get<any>(`${environment.apiUrl}/boutiques/mes-infos/${user.id}`)
        .subscribe({
          next: (data) => {
            this.maBoutique = data.boutique;
            this.mesProduits = data.produits;
            this.messageErreur = ''; 
          },
          error: (err) => {
            this.messageErreur = "Impossible de charger votre boutique. Vérifiez votre connexion ou l'assignation du box.";
          }
        });
    }
  }

  // Action : Envoyer le formulaire (Détecte si c'est une Création ou une Mise à jour)
  // Action : Envoyer le formulaire
  onSubmit() {
    if (this.isEditMode) {
      // --- CAS UPDATE ---
      // Ici l'ID est nécessaire car il existe déjà en base
      this.productService.update(this.productForm._id, this.productForm).subscribe({
        next: () => {
          this.resetForm();
          this.refreshData();
          alert("Produit mis à jour !");
        },
        error: (err) => console.error("Erreur update", err)
      });
    } else {
      // --- CAS CREATE ---
      // 💡 ASTUCE : On extrait l'ID pour ne PAS l'envoyer (il est vide)
      const { _id, ...cleanData } = this.productForm; 
      
      const payload = { 
        ...cleanData, 
        id_boutique: this.maBoutique._id 
      };

      this.productService.create(payload).subscribe({
        next: () => {
          this.resetForm();
          this.refreshData();
          alert("Produit ajouté avec succès !");
        },
        error: (err) => {
          console.error("Détail de l'erreur serveur :", err.error);
          alert("Erreur lors de la création. Vérifie la console.");
        }
      });
    }
  }

  // Action : Préparer la modification
  startEdit(produit: any) {
    this.isEditMode = true;
    // On utilise le "spread operator" {...produit} pour créer une copie
    // et ne pas modifier la liste en direct avant d'avoir cliqué sur sauvegarder
    this.productForm = { ...produit }; 
  }

  // Action : Supprimer
  onDelete(id: string) {
    if (confirm("Supprimer ce produit définitivement ?")) {
      this.productService.delete(id).subscribe({
        next: () => this.refreshData(),
        error: (err) => console.error("Erreur suppression", err)
      });
    }
  }

  resetForm() {
    this.productForm = { _id: '', nom: '', prix: 0, description: '' };
    this.isEditMode = false;
  }
}