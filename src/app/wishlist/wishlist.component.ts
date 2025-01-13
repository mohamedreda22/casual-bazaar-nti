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
  wishlist: Wishlist = {
    _id: '',
    userId: '',
    items: [],
    createdAt: new Date().toISOString(),
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // this.initializeWishlist();
  }

  //get wishlist items
  getWishlistItems(): void {
    this.productService.getWishlistByUserId(this.userId).subscribe({
      next: (response) => {
        console.log('Wishlist loaded:', response);
        this.wishlist = response;
      },
      error: (err) => console.error('Error loading wishlist:', err),
    });
  }

  /*   initializeWishlist(): void {
    const userId = this.productService.getUserId();
    if (userId) {
      this.userId = userId;
      this.wishlist.userId = userId;

      // Fetch wishlist data from a service or API
      this.productService
        .getWishlistByUserId(this.userId)
        .subscribe((data: Wishlist) => {
          this.wishlist = data;
        });
    } else {
      console.error('User ID not found.');
    }
  }

  addItem(item: WishlistItem): void {
    // Prevent adding duplicates
    const exists = this.wishlist.items.some(
      (i: WishlistItem) => i.productId === item.productId
    );
    if (exists) {
      console.warn('Item already exists in the wishlist.');
      return;
    }

    this.wishlist.items.push(item);
    this.updateWishlist();
  }

  removeItem(item: WishlistItem): void {
    const index = this.wishlist.items.findIndex(
      (i: WishlistItem) => i.productId === item.productId
    );
    if (index > -1) {
      this.wishlist.items.splice(index, 1);
      this.updateWishlist();
    } else {
      console.warn('Item not found in the wishlist.');
    }
  }

  removeFromWishlist(item: WishlistItem): void {
    this.removeItem(item);
  }

  updateWishlist(): void {
    this.productService.updateWishlist(this.wishlist).subscribe({
      next: () => console.log('Wishlist updated successfully.'),
      error: (err) => console.error('Failed to update wishlist:', err),
    });
  } */
}
