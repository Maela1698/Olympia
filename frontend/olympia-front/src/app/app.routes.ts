import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { BoutiqueDashboardComponent } from './pages/boutique-dashboard/boutique-dashboard.component';
import { HomeComponent } from './pages/client-home/client-home.component'; 
import { adminGuard } from './guards/admin.guard';
import { boutiqueGuard } from './guards/boutique.guard';
import { AdminCategoriesComponent } from './pages/admin-categories/admin-categories.component';
import { AdminBoutiqueCreationComponent } from './pages/admin-boutique-creation/admin-boutique-creation.component';
import { BoutiqueSettingsComponent } from './features/boutique/boutique-settings/boutique-settings.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { BoutiqueStoreComponent } from './pages/boutique-store/boutique-store.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminBoxesComponent } from './pages/admin-boxes/admin-boxes.component';
import { AdminBoutiquesComponent } from './pages/admin-boutiques/admin-boutiques.component';



export const routes: Routes = [
  // 1. ZONE PUBLIQUE (Client)
  { 
    path: '', 
    component: ClientLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'boutique-client/:id', component: BoutiqueStoreComponent },
      { path: 'produit-client/:id', component: ProductDetailComponent }
    ]
  },
  // 2. Zone Admin (Protégée par adminGuard)
  { 
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      // Plus tard tu ajouteras : { path: 'boutiques', component: ManageBoutiquesComponent }
      { path: 'boxes', component: AdminBoxesComponent },
      { path: 'boutiques', component: AdminBoutiquesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'create-boutique', component: AdminBoutiqueCreationComponent },
      { path: 'edit-boutique/:id', component: AdminBoutiqueCreationComponent },
    ]
  },

  // 3. Zone Boutique (Protégée par boutiqueGuard)
  { 
    path: 'boutique',
    component: AdminLayoutComponent,
    canActivate: [boutiqueGuard],
    children: [
      { path: 'dashboard', component: BoutiqueDashboardComponent },
      // Plus tard tu ajouteras : { path: 'produits', component: ManageProductsComponent }
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'produits', component: ProductListComponent }, // Liste
      { path: 'produits/nouveau', component: ProductFormComponent }, // Création
      { path: 'produits/modifier/:id', component: ProductFormComponent }, // Modification
      { path: 'settings', component: BoutiqueSettingsComponent }
     
    ]
  }
];