import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth.service.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartCount: number = 5; // Hardcoded value for testing
  constructor(
    private authService: AuthServiceService,
    private cartService: CartService,
    private router: Router
  ) {}

  isAuthanticated = false;
  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.isAuthanticated = this.authService.isAuthanticated();
    this.cartService.getCartCount(userId).subscribe({
      next: (count) => {
        console.log('Cart count:', count);
        this.cartCount = count;
      },
      error: (err) => {
        console.error('Error fetching cart count:', err);
        this.cartCount = 0;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}