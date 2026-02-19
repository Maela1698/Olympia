import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BoutiqueService } from '../../../services/boutique.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-boutique-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './boutique-settings.component.html',
  styleUrl: './boutique-settings.component.css'
})
export class BoutiqueSettingsComponent implements OnInit {
  fb = inject(FormBuilder);
  boutiqueService = inject(BoutiqueService);
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);

  settingsForm: FormGroup;
  boutiqueId: string | null = null;
  activeBoutiqueName: string = '';
  currentLogo: string = ''; 
  selectedFile: File | null = null;
  toastMessage: string = '';

  mesBoutiques: any[] = []; // 👈 On va stocker toutes ses boutiques ici

  constructor() {
    this.settingsForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      est_ouvert: [false]
    });
  }

  ngOnInit() {
    this.loadToutesLesBoutiques();
  }

// 1. Charger toutes les boutiques du vendeur pour le menu déroulant
  loadToutesLesBoutiques() {
    const user = this.authService.getUser();
    if (user?.id) {
      this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`).subscribe({
        next: (toutes) => {
          this.mesBoutiques = toutes.filter(b => b.id_responsable?._id === user.id || b.id_responsable === user.id);
          
          if (this.mesBoutiques.length > 0) {
            let activeId = localStorage.getItem('activeBoutiqueId');
            
            if (!activeId) {
              activeId = this.mesBoutiques[0]._id;
              localStorage.setItem('activeBoutiqueId', activeId as string); // 👈 Sécurité ici
              localStorage.setItem('activeBoutiqueName', this.mesBoutiques[0].nom);
            }
            
            this.boutiqueId = activeId;
            this.activeBoutiqueName = localStorage.getItem('activeBoutiqueName') || '';
            
            this.loadBoutiqueSettings(activeId as string); // 👈 Le "as string" règle l'erreur !
          }
        }
      });
    }
  }

  // 2. Charger les données d'une boutique spécifique dans le formulaire
  loadBoutiqueSettings(id: string) {
    this.http.get<any>(`${environment.apiUrl}/boutiques/${id}`).subscribe({
      next: (data) => {
        const b = data.boutique || data;
        this.currentLogo = b.logo;
        
        // On remplit le formulaire
        this.settingsForm.patchValue({
          nom: b.nom,
          description: b.description,
          est_ouvert: b.est_ouvert
        });
        
        // On réinitialise le fichier image sélectionné
        this.selectedFile = null; 
      }
    });
  }

  // 3. Action déclenchée quand il change de boutique dans le menu déroulant
  onBoutiqueChange(event: any) {
    const newBoutiqueId = event.target.value;
    this.boutiqueId = newBoutiqueId;
    
    // On met à jour le LocalStorage
    localStorage.setItem('activeBoutiqueId', newBoutiqueId);
    const boutiqueChoisie = this.mesBoutiques.find(b => b._id === newBoutiqueId);
    if (boutiqueChoisie) {
      this.activeBoutiqueName = boutiqueChoisie.nom;
      localStorage.setItem('activeBoutiqueName', boutiqueChoisie.nom);
    }
    
    // On recharge le formulaire avec les nouvelles données
    this.loadBoutiqueSettings(newBoutiqueId);
  }

  // ... (Garde tes fonctions onFileSelected, showToast et onSubmit telles quelles) ...

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => this.currentLogo = e.target.result;
      reader.readAsDataURL(this.selectedFile as Blob);
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => { this.toastMessage = ''; }, 3000);
  }

  onSubmit() {
    if (!this.boutiqueId) return;

    const formData = new FormData();
    formData.append('nom', this.settingsForm.get('nom')?.value);
    formData.append('description', this.settingsForm.get('description')?.value);
    formData.append('est_ouvert', this.settingsForm.get('est_ouvert')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile); 
    }

    this.boutiqueService.update(this.boutiqueId, formData).subscribe({
      next: () => {
        this.showToast('✅ Configuration enregistrée avec succès !');
        localStorage.setItem('activeBoutiqueName', this.settingsForm.get('nom')?.value);
        this.activeBoutiqueName = this.settingsForm.get('nom')?.value;
        
        // On met aussi à jour le nom dans la liste déroulante
        const boutiqueDansListe = this.mesBoutiques.find(b => b._id === this.boutiqueId);
        if (boutiqueDansListe) boutiqueDansListe.nom = this.settingsForm.get('nom')?.value;
      },
      error: (err) => alert("Erreur lors de la mise à jour")
    });
  }
}