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
  boxes: any[] = [];
  boutiques: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les boxes
    this.http.get<any[]>(`${environment.apiUrl}/boxes`).subscribe(data => this.boxes = data);
    
    //On appelle la route '/admin/all' 👇
    this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`)
      .subscribe(data => this.boutiques = data);
  }
  deleteBoutique(id: string) {
    if(confirm("🛑 ATTENTION : Supprimer la boutique effacera tous ses produits et libérera le Box. Continuer ?")) {
      this.http.delete(`${environment.apiUrl}/boutiques/${id}`).subscribe({
        next: () => {
          alert("Suppression réussie !");
          this.loadData(); // On recharge pour voir le box redevenir vert
        },
        error: (err) => alert("Erreur lors de la suppression")
      });
    }
  }
}