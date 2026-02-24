import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  http = inject(HttpClient);

  // Statistiques
  totalBoxes: number = 0;
  boxesLoues: number = 0;
  boxesLibres: number = 0;
  tauxOccupation: number = 0;
  
  totalBoutiques: number = 0;
  totalCategories: number = 0;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // 1. Charger et calculer les stats des Boxes
    this.http.get<any[]>(`${environment.apiUrl}/boxes`).subscribe(boxes => {
      this.totalBoxes = boxes.length;
      this.boxesLoues = boxes.filter(b => b.est_loue).length;
      this.boxesLibres = this.totalBoxes - this.boxesLoues;
      
      if (this.totalBoxes > 0) {
        this.tauxOccupation = Math.round((this.boxesLoues / this.totalBoxes) * 100);
      }
    });

    // 2. Compter les Boutiques
    this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`).subscribe(boutiques => {
      this.totalBoutiques = boutiques.length;
    });

    // 3. Compter les Catégories
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe(categories => {
      this.totalCategories = categories.length;
    });
  }
}