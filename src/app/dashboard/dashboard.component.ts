import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  currentSection: string = 'products';

  showSection(section: string): void {
    this.currentSection = section;
  }
}
