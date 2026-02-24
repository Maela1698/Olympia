import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // 👈 1. IMPORT OBLIGATOIRE
import { environment } from '../../../environments/environment';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-client-home',
  standalone: true,
  // 👇 2. AJOUTE RouterModule ICI pour que [routerLink] fonctionne dans le HTML
  imports: [CommonModule, RouterModule,ImageUrlPipe], 
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class HomeComponent implements OnInit { // 👈 3. J'ai gardé 'HomeComponent' pour matcher tes routes
  private http = inject(HttpClient);
  
  boutiques: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadBoutiques();
  }

  loadBoutiques() {
    this.http.get<any[]>(`${environment.apiUrl}/boutiques`).subscribe({
      next: (data) => {
        this.boutiques = data;
        this.isLoading = false;
        console.log("Boutiques reçues :", data);
      },
      error: (err) => {
        console.error("Erreur chargement boutiques", err);
        this.isLoading = false;
      }
    });
  }
}