import { Component, OnInit } from '@angular/core';
import { Wishlist } from '../interfaces/wishlistInterface';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  userId: string = '';
  wishlist: Wishlist | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Simulate getting the userId
    this.userId = this.productService.getUserId() || 'dummyUserId';
    this.getWishlistItems();
  }

  // Fetch wishlist items
  getWishlistItems(): void {
    this.productService.getWishlistByUserId(this.userId).subscribe({
      next: (data) => {
        this.wishlist = data;
        const items = this.wishlist ? this.wishlist.items : [];
        console.log('Wishlist fetched:', items);

      },
      error: (err) => console.error('Failed to fetch wishlist:', err),
    });
  }

  // Remove item from wishlist
  removeFromWishlist(productId: string): void {
    this.productService.removeFromWishlist(productId).subscribe({
      next: (data) => {
        this.getWishlistItems();
        console.log('Item removed from wishlist:', data);
      },
      error: (err) =>
        console.error('Failed to remove item from wishlist:', err),
    });
  }
}
