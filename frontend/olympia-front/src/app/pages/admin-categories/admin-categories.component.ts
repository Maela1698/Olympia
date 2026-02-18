import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css' // Crée le fichier CSS si besoin
})
export class AdminCategoriesComponent implements OnInit {
  categoryService = inject(CategoryService);

  categories: any[] = [];
  formCat = { _id: '', nom: '', image: '' }; // Modèle du formulaire
  isEditMode = false;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  onSubmit() {
    if (this.isEditMode) {
      // UPDATE
      this.categoryService.update(this.formCat._id, this.formCat).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
    } else {
      // CREATE (On enlève l'ID vide)
      const { _id, ...newCat } = this.formCat;
      this.categoryService.create(newCat).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
    }
  }

  startEdit(cat: any) {
    this.isEditMode = true;
    this.formCat = { ...cat }; // Copie pour édition
  }

  deleteCategory(id: string) {
    if (confirm("Supprimer cette catégorie ?")) {
      this.categoryService.delete(id).subscribe(() => this.loadCategories());
    }
  }

  resetForm() {
    this.formCat = { _id: '', nom: '', image: '' };
    this.isEditMode = false;
  }
}