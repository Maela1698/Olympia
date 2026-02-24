import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-boutiques',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './admin-boutiques.component.html',
  styleUrl: './admin-boutiques.component.css'
})
export class AdminBoutiquesComponent implements OnInit {
   http = inject(HttpClient);
   boutiques: any[] = [];
   toastMessage: string = ''; // 👈 Pour la notification

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>(`${environment.apiUrl}/boutiques/admin/all`)
      .subscribe(data => this.boutiques = data);
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => { this.toastMessage = ''; }, 3000);
  }

  deleteBoutique(id: string) {
    if(confirm("🛑 ATTENTION : Supprimer la boutique effacera tous ses produits et libérera le Box. Continuer ?")) {
      this.http.delete(`${environment.apiUrl}/boutiques/${id}`).subscribe({
        next: () => {
          this.showToast('🗑️ Boutique supprimée avec succès et Box libéré.');
          this.loadData();
        },
        error: (err) => alert("Erreur lors de la suppression")
      });
    }
  }
}