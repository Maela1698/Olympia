import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  http = inject(HttpClient);
  boxes: any[] = [];

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/boxes`).subscribe({
      next: (data) => {
        this.boxes = data;
      },
      error: (err) => console.error(err)
    });
  }
}