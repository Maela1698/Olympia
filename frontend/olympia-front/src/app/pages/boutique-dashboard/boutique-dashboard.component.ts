import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Important pour les liens
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-boutique-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './boutique-dashboard.component.html',
  styleUrl: './boutique-dashboard.component.css'
})
export class BoutiqueDashboardComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  maBoutique: any = null;

  ngOnInit() {
    // On charge juste les infos de la boutique (Nom, Box...)
    const user = this.authService.getUser();
    if (user?.id) {
      this.http.get<any>(`${environment.apiUrl}/boutiques/mes-infos/${user.id}`)
        .subscribe(data => this.maBoutique = data.boutique);
    }
  }
}