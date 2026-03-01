import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // 👈 Ajout de RouterModule
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // 👈 N'oublie pas RouterModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // 👇 NOUVELLE VARIABLE : Détecte si on est sur le portail ou sur un formulaire
  currentRole: string | null = null; 

  constructor() {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // On lit le rôle dans l'URL (ex: /login?role=admin)
      this.currentRole = params['role'] || null;

      // Si un rôle est trouvé, on pré-remplit le formulaire !
      if (this.currentRole === 'admin') {
        this.loginForm.patchValue({ mail: 'admin@test.com', password: '123456' });
      } else if (this.currentRole === 'commercial') {
        this.loginForm.patchValue({ mail: 'commercial@olympia.mg', password: '123456' });
      } else if (this.currentRole === 'client') {
        this.loginForm.patchValue({ mail: 'safidy@client.mg', password: '123456' });
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        const role = response.user.role; 
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');

        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin');
        }

        switch (role) {
          case 'admin':
            this.router.navigate(['/admin/dashboard']);
            break;
          case 'commercial': 
            this.router.navigate(['/boutique/dashboard']);
            break;
          case 'client':
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