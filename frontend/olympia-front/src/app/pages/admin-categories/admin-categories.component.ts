import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  categoryService = inject(CategoryService);

  categories: any[] = [];
  formCat = { _id: '', nom: '', image: '' };
  
  isEditMode = false;
  showModal = false; // 👈 Gère l'affichage du Pop-up
  toastMessage = ''; // 👈 Gère la notification

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  // --- SYSTÈME DE NOTIFICATION ---
  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => { this.toastMessage = ''; }, 3000);
  }

  // --- GESTION DU POP-UP (MODAL) ---
  openCreateModal() {
    this.isEditMode = false;
    this.formCat = { _id: '', nom: '', image: '' };
    this.showModal = true;
  }

  startEdit(cat: any) {
    this.isEditMode = true;
    this.formCat = { ...cat }; // Copie pour ne pas modifier le tableau en direct
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formCat = { _id: '', nom: '', image: '' };
  }

  // --- ACTIONS CRUD ---
  onSubmit() {
    if (this.isEditMode) {
      this.categoryService.update(this.formCat._id, this.formCat).subscribe(() => {
        this.closeModal();
        this.loadCategories();
        this.showToast('✅ Catégorie modifiée avec succès !');
      });
    } else {
      const { _id, ...newCat } = this.formCat; // On enlève l'ID vide
      this.categoryService.create(newCat).subscribe(() => {
        this.closeModal();
        this.loadCategories();
        this.showToast('🎉 Nouvelle catégorie ajoutée !');
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm("Supprimer définitivement cette catégorie ?")) {
      this.categoryService.delete(id).subscribe(() => {
        this.loadCategories();
        this.showToast('🗑️ Catégorie supprimée.');
      });
    }
  }
}