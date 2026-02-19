import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BoutiqueService } from '../../../services/boutique.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-boutique-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './boutique-settings.component.html',
  styles: [`.preview-img { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #ddd; }`]
})
export class BoutiqueSettingsComponent implements OnInit {
  fb = inject(FormBuilder);
  boutiqueService = inject(BoutiqueService);
  authService = inject(AuthService);
  router = inject(Router);

  settingsForm: FormGroup;
  boutiqueId: string = '';
  currentLogo: string = ''; 
  selectedFile: File | null = null;

  constructor() {
    this.settingsForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      est_ouvert: [false]
    });
  }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user?.id) {
      this.boutiqueService.getMaBoutique(user.id).subscribe({
        next: (data) => {
          const b = data.boutique;
          this.boutiqueId = b._id;
          this.currentLogo = b.logo;
          
          // Remplir le formulaire avec les données actuelles
          this.settingsForm.patchValue({
            nom: b.nom,
            description: b.description,
            est_ouvert: b.est_ouvert
          });
        }
      });
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      
      // Prévisualisation immédiate
      const reader = new FileReader();
      reader.onload = (e: any) => this.currentLogo = e.target.result;
      reader.readAsDataURL(this.selectedFile as Blob);
    }
  }

  onSubmit() {
    const formData = new FormData();
    // On ajoute les champs texte
    formData.append('nom', this.settingsForm.get('nom')?.value);
    formData.append('description', this.settingsForm.get('description')?.value);
    // Important : conversion booléen -> string pour FormData
    formData.append('est_ouvert', this.settingsForm.get('est_ouvert')?.value);

    // On ajoute l'image SEULEMENT si l'utilisateur en a choisi une nouvelle
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); 
    }

    this.boutiqueService.update(this.boutiqueId, formData).subscribe({
      next: () => {
        alert('Modifications enregistrées !');
        this.router.navigate(['/boutique/dashboard']);
      },
      error: (err) => alert("Erreur lors de la mise à jour")
    });
  }
}