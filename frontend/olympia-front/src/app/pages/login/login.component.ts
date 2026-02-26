import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // IMPORTANT: Assure-toi que response.user.role renvoie bien 'admin', 'commercial' ou 'client'
        const role = response.user.role; 
        const redirectUrl = localStorage.getItem('redirectAfterLogin');

        // On nettoie la mémoire immédiatement
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
        }

        // --- AIGUILLAGE STRICT SELON LE RÔLE ---
        switch (role) {
          case 'admin':
            // L'admin va TOUJOURS sur son dashboard
            this.router.navigate(['/admin/dashboard']);
            break;
            
          case 'commercial': 
            // Le commercial va TOUJOURS sur son dashboard
            this.router.navigate(['/boutique/dashboard']);
            break;
            
          case 'client':
            // SEUL LE CLIENT a le droit de retourner au produit qu'il voulait acheter !
            if (redirectUrl) {
              this.router.navigateByUrl(redirectUrl);
            } else {
              this.router.navigate(['/']);
            }
            break;
            
          default:
            this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Email ou mot de passe incorrect";
      }
    });
  }
}