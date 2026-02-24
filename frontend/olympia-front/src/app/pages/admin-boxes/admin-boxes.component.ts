import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-admin-boxes',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-boxes.component.html',
  styleUrl: './admin-boxes.component.css'
})
export class AdminBoxesComponent implements OnInit {

  // 👇 AJOUTE CETTE VARIABLE POUR LE MESSAGE
  toastMessage: string = '';

  // 👇 AJOUTE CETTE FONCTION POUR AFFICHER LE MESSAGE 3 SECONDES
  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  http = inject(HttpClient);
  
  boxes: any[] = [];
  
  showBoxForm = false;
  isEditMode = false;
  currentBoxId: string | null = null;

  boxForm = {
    nom: '',
    etage: 0,
    surface: 10,
    est_loue: false
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>(`${environment.apiUrl}/boxes`).subscribe(data => this.boxes = data);
  }

  openCreateBox() {
    this.showBoxForm = true;
    this.isEditMode = false;
    this.boxForm = { nom: '', etage: 0, surface: 10, est_loue: false };
  }

  openEditBox(box: any) {
    this.showBoxForm = true;
    this.isEditMode = true;
    this.currentBoxId = box._id;
    this.boxForm = { nom: box.nom, etage: box.etage, surface: box.surface, est_loue: box.est_loue };
  }

  saveBox() {
    if (this.isEditMode && this.currentBoxId) {
      this.http.put(`${environment.apiUrl}/boxes/${this.currentBoxId}`, this.boxForm).subscribe({
        next: () => { 
          this.loadData(); 
          this.showBoxForm = false; 
          this.currentBoxId = null; 
          this.showToast('Box modifié avec succès !'); 
        },
        error: () => alert("Erreur lors de la modification")
      });
    } else {
      this.http.post(`${environment.apiUrl}/boxes`, this.boxForm).subscribe({
        next: () => { 
          this.loadData(); 
          this.showBoxForm = false; 
          this.showToast(' Nouveau box créé avec succès !'); 
        },
        error: () => alert("Erreur : Ce nom de box existe peut-être déjà ?")
      });
    }
  }

  deleteBox(box: any) {
    if (box.est_loue) {
      alert("Impossible de supprimer : Ce box est actuellement loué !");
      return;
    }
    if(confirm(`Supprimer définitivement le box ${box.nom} ?`)) {
      this.http.delete(`${environment.apiUrl}/boxes/${box._id}`).subscribe({
        next: () => {
          this.loadData();
          this.showToast(' Box supprimé avec succès.');
        },
        error: (err) => alert(err.error.message || "Impossible de supprimer")
      });
    }
  }

  cancelBox() {
    this.showBoxForm = false;
    this.currentBoxId = null;
  }
}