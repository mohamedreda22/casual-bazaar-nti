import { Component, OnInit } from '@angular/core';
import { Wishlist } from '../interfaces/wishlistInterface';
import { WishlistService } from '../services/wishlist.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth.service.service';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  userId: string = '';
  wishlist: Wishlist[] = [];
  imgURL = 'http://localhost:3000/images/';
  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private _authS: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.userId = this._authS.getUserId();
    this.getWishlistItems();
    this.fetchWishlist();
  }

  navigateToAddItems() {
    this.router.navigate(['/shop']);
  }

  fetchWishlist() {
    this.wishlistService
      .getWishlist(this.userId)
      .subscribe((data: Wishlist[]) => {
        this.wishlist = data.map((list) => ({
          ...list,
          items: list.items.map((item) => ({
            ...item,
            productId: item.productId,
          })),
        }));
      });
  }

  // Fetch wishlist items
  getWishlistItems(): void {
    if (!this.userId) {
      console.error('User ID is not set.');
      return;
    }
    this.wishlistService.getWishlist(this.userId).subscribe({
      next: (data: Wishlist[]) => {
        this.wishlist = data;
        console.log('Wishlist fetched:', this.wishlist);
      },
      error: (err) => {
        this.wishlist = [];
        console.error('Failed to fetch wishlist:', err);
      },
    });
  }

  // Remove item from wishlist
  removeFromWishlist(productId: string): void {
    if (!this.userId) return;

    // Update the first wishlist containing the product immediately
    for (const list of this.wishlist) {
      list.items = list.items.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    this.wishlistService
      .removeItemFromWishlist(this.userId, productId)
      .subscribe({
        next: () => {
          console.log('Item removed from wishlist');
          Swal.fire({
            icon: 'success',
            title: 'Item removed from wishlist',
            showConfirmButton: true,
            timer: 1500,
          });
          this.fetchWishlist();
        },
        error: (err) => {
          console.error('Failed to remove item from wishlist:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to remove item from wishlist',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
  }

  addItemToWishlist(productId: string): void {
    const productExists = this.wishlist.some((list) =>
      list.items.some((item) => item.productId.toString() === productId)
    );

    if (productExists) {
      console.warn('Product already exists in the wishlist');
      return;
    }

    this.wishlistService
      .addItemToWishlist(this.userId, { productId })
      .subscribe({
        next: (updatedWishlist) => {
          // Update local wishlist
          this.wishlist = this.wishlist.map((list) =>
            list.userId === updatedWishlist.userId ? updatedWishlist : list
          );
          console.log('Item added to wishlist:', updatedWishlist);
        },
        error: (err) => console.error('Failed to add item to wishlist:', err),
      });
  }
}
