import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';


@Component({
  selector: 'app-vendor-boutiques',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './vendor-boutiques.component.html',
  styleUrl: './vendor-boutiques.component.css'
})
export class VendorBoutiquesComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  mesBoutiques: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadMesBoutiques();
  }

 loadMesBoutiques() {
    const user = this.authService.getUser();
    
    if (user?.id) {
      // ON UTILISE L'API ADMIN (qui ramène tout) ET ON FILTRE CÔTÉ FRONTEND
      this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`)
        .subscribe({
          next: (toutesLesBoutiques) => {
            
            // 🪄 LA MAGIE EST ICI : On filtre pour ne garder que ses boutiques à lui !
            this.mesBoutiques = toutesLesBoutiques.filter(b => 
              (b.id_responsable?._id === user.id) || (b.id_responsable === user.id)
            );
            
            this.isLoading = false;
          },
          error: (err) => {
            console.error("Erreur de chargement", err);
            this.isLoading = false;
          }
        });
    } else {
      this.isLoading = false;
    }
  }

  // 🔥 LA FONCTION CLÉ DE L'ARCHITECTURE MULTI-BOUTIQUES 🔥
  gererBoutique(boutique: any) {
    // 1. On sauvegarde l'ID et le nom dans la mémoire locale du navigateur
    localStorage.setItem('activeBoutiqueId', boutique._id);
    localStorage.setItem('activeBoutiqueName', boutique.nom);
    this.router.navigate(['/boutique/produits']);
  }
}