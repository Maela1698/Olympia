import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 👈 Vérifie bien ce chemin selon ton projet

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Variables pour stocker l'utilisateur et l'état du menu
  currentUser: any = null;
  isDropdownOpen = false;

  ngOnInit() {
    // Récupérer l'utilisateur connecté depuis ton service
    this.currentUser = this.authService.getUser();
  }

  get isRouteAdmin(): boolean {
    return this.router.url.includes('/admin');
  }

  // Permet d'afficher la première lettre de son nom dans la bulle
  get userInitials(): string {
    if (this.currentUser && this.currentUser.name) {
      return this.currentUser.name.charAt(0).toUpperCase();
    }
    return this.isRouteAdmin ? 'A' : 'V';
  }

  // Ouvre ou ferme le menu déroulant
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Gère la déconnexion
  logout() {
    this.authService.logout(); // Appelle la fonction de ton service qui vide le LocalStorage
    this.router.navigate(['/']); // Redirige vers la page d'accueil client
  }

  // 💡 Petite astuce Pro : Ferme le menu si on clique n'importe où ailleurs sur la page
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.isDropdownOpen = false;
    }
  }
}