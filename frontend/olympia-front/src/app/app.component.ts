import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router'; // 👈 Importe bien RouterLink aussi !

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // 👈 Ajoute-les ici
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}