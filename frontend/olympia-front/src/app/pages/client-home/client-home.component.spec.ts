import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; // 👈 1. Indispensable pour éviter l'erreur "No provider for HttpClient"
import { provideRouter } from '@angular/router'; // 👈 2. Indispensable car tu utilises routerLink

// 👇 3. On importe le bon nom de classe (HomeComponent) depuis le fichier
import { HomeComponent } from './client-home.component';

describe('HomeComponent', () => { // On peut garder le nom du fichier ou de la classe ici
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 👇 4. On importe le composant Standalone
      imports: [HomeComponent], 
      // 👇 5. On fournit les outils dont le composant a besoin (Http et Router)
      providers: [
        provideHttpClient(),
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});