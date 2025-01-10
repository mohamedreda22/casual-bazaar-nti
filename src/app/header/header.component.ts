import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth.service.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartCount: number =0; // Hardcoded value for testing
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to isAuthenticated and isAdmin to ensure we wait for the response
    this.authService.isAuthenticated().subscribe({
      next: (isAuth) => {
        this.isAuthenticated = isAuth;

        // Fetch cart count only after authentication status is known
        if (this.isAuthenticated) {
          const userId = this.authService.getUserId();
          this.cartService.getCartCount(userId).subscribe({
            next: (count) => {
              // console.log('Cart count:', count);
              this.cartCount = count;
            },
            error: (err) => {
              console.error('Error fetching cart count:', err);
              this.cartCount = 0;
            },
          });
        }
      },
      error: (err) => {
        console.error('Error checking authentication status:', err);
      },
    });

    // Also subscribe to isAdmin for admin-specific logic
    this.authService.isAdmin().subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
      },
      error: (err) => {
        console.error('Error checking admin status:', err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
