import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { BoutiqueDashboardComponent } from './pages/boutique-dashboard/boutique-dashboard.component';
import { HomeComponent } from './pages/client-home/client-home.component'; 
import { adminGuard } from './guards/admin.guard';
import { boutiqueGuard } from './guards/boutique.guard';
import { AdminCategoriesComponent } from './pages/admin-categories/admin-categories.component';
import { AdminBoutiqueCreationComponent } from './pages/admin-boutique-creation/admin-boutique-creation.component';

export const routes: Routes = [
  // 1. Zone Publique (Client)
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // 2. Zone Admin (Protégée par adminGuard)
  { 
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      // Plus tard tu ajouteras : { path: 'boutiques', component: ManageBoutiquesComponent }
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'create-boutique', component: AdminBoutiqueCreationComponent },
    ]
  },

  // 3. Zone Boutique (Protégée par boutiqueGuard)
  { 
    path: 'boutique',
    canActivate: [boutiqueGuard],
    children: [
      { path: 'dashboard', component: BoutiqueDashboardComponent },
      // Plus tard tu ajouteras : { path: 'produits', component: ManageProductsComponent }
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];