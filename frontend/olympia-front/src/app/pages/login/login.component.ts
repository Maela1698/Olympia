import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Important : On importe le module de formulaire ici
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Injection des dépendances (nouvelle syntaxe Angular)
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor() {
    // Initialisation du formulaire avec validation
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // src/app/pages/login/login.component.ts

onSubmit() {
  if (this.loginForm.invalid) return;

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      // 1. On récupère le rôle renvoyé par le backend
      const role = response.user.role; 

      // 2. Aiguillage vers la bonne page
      switch (role) {
        case 'admin':
          // L'admin du centre va vers son tableau de bord global
          this.router.navigate(['/admin/dashboard']);
          break;
          
        case 'commercial': // ou 'responsable_boutique' selon ta DB
          // Le vendeur va vers la gestion de SA boutique
          this.router.navigate(['/boutique/dashboard']);
          break;
          
        case 'client':
          // Le client retourne à l'accueil pour faire ses achats
          this.router.navigate(['/']);
          break;
          
        default:
          // Sécurité : si le rôle est inconnu, on le renvoie à l'accueil
          this.router.navigate(['/']);
      }
    },
    error: (err) => {
      this.errorMessage = "Email ou mot de passe incorrect";
    }
  });
}
}