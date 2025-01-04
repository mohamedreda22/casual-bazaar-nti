import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  isAuthenticated = false;

  ngOnInit(): void {
    this.authService.getAccessToken().subscribe((token) => {
      this.isAuthenticated = token !== null;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
