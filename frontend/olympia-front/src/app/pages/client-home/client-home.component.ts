import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  
  boutiques: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadBoutiques();
  }

  loadBoutiques() {
    // On appelle notre nouvelle route API
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