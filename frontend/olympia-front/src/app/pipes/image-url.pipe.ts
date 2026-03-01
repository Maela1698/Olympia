import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(imageName: string | undefined | null): string {
    // Si pas de nom d'image, on retourne le placeholder local
    if (!imageName) {
      return 'assets/placeholder-shop.jpg';
    }

    // On construit TOUJOURS l'URL avec l'API du moment (Local ou Prod)
    // Résultat : http://localhost:3000/uploads/nom-image.jpg
    return `${environment.imageUrl}/uploads/${imageName}`;
  }
}