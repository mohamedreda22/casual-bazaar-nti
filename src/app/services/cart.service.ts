import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = []; // In-memory cart items (replace with real API calls)

  constructor() {}

  // Get cart items
  getCartItems(): Observable<any[]> {
    return of(this.cartItems);
  }

  // Update an item in the cart
  updateCartItem(productId: string, updatedItem: any): Observable<any[]> {
    const index = this.cartItems.findIndex((item) => item.id === productId);
    if (index > -1) {
      this.cartItems[index] = updatedItem;
    }
    return of(this.cartItems);
  }

  // Add an item to the cart
  addCartItem(product: any): Observable<any[]> {
    this.cartItems.push(product);
    return of(this.cartItems);
  }

  // Remove an item from the cart
  removeCartItem(productId: string): Observable<any[]> {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    return of(this.cartItems);
  }


  // Clear the entire cart (optional)
  clearCart(): Observable<any[]> {
    this.cartItems = [];
    return of(this.cartItems);
  }
}
