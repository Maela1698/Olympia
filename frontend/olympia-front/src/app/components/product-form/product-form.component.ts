import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  // Injections
  fb = inject(FormBuilder);
  productService = inject(ProductService);
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Variables du formulaire
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  boutiqueId: string = '';

  // Gestion des images
  selectedFiles: File[] = []; // Les NOUVEAUX fichiers (upload)
  existingImages: string[] = []; // Les ANCIENNES images (déjà en ligne)

  constructor() {
    this.productForm = this.fb.group({
      nom: ['', Validators.required],
      prix: [0, Validators.required],
      description: [''],
      promo: [false]
    });
  }

  ngOnInit() {
    // 1. Récupérer l'ID de la boutique du commerçant
    const user = this.authService.getUser();
    if (user?.id) {
      this.http.get<any>(`${environment.apiUrl}/boutiques/mes-infos/${user.id}`)
        .subscribe(data => {
          this.boutiqueId = data.boutique._id;
        });
    }

    // 2. Vérifier si on est en mode modification
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.productService.getById(this.productId).subscribe(p => {
        // Remplir le formulaire
        this.productForm.patchValue(p);

        // Remplir les images existantes
        if (p.images && Array.isArray(p.images)) {
          this.existingImages = p.images;
        }
      });
    }
  }

  // Sélectionner de nouveaux fichiers depuis l'ordinateur
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  // Supprimer une ancienne image de la liste (visuellement)
  removeExistingImage(imageToRemove: string) {
    if(confirm("Voulez-vous supprimer cette image ? (L'action sera validée lors de l'enregistrement)")) {
      // On garde toutes les images SAUF celle qu'on vient de cliquer
      this.existingImages = this.existingImages.filter(img => img !== imageToRemove);
    }
  }

  onSubmit() {
    const formData = new FormData();
    
    // 1. Ajout des champs texte
    formData.append('nom', this.productForm.get('nom')?.value);
    formData.append('prix', this.productForm.get('prix')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('promo', this.productForm.get('promo')?.value);
    formData.append('id_boutique', this.boutiqueId);

    // 2. Ajout des images à GARDER (liste filtrée par l'utilisateur)
    // Le backend comparera cette liste avec la BDD pour supprimer celles qui manquent
    if (this.existingImages.length > 0) {
      this.existingImages.forEach(imgUrl => {
        formData.append('imagesToKeep', imgUrl);
      });
    }

    // 3. Ajout des NOUVELLES images (fichiers)
    for (let file of this.selectedFiles) {
      formData.append('images', file);
    }

    // 4. Envoi au serveur
    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, formData).subscribe({
        next: () => this.router.navigate(['/boutique/produits']),
        error: (err) => alert("Erreur lors de la modification")
      });
    } else {
      this.productService.create(formData).subscribe({
        next: () => this.router.navigate(['/boutique/produits']),
        error: (err) => alert("Erreur lors de la création")
      });
    }
  }
}