import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart'; // Base URL for the cart API
  private productUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // Get cart items by userId
  getCartItems(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Error getting cart items:', error);
        return throwError(() => new Error('Failed to fetch cart items'));
      })
    );
  }

  // Get product details by productId
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.productUrl}/${productId}`).pipe(
      catchError((error) => {
        console.error('Error getting product details:', error);
        return throwError(() => new Error('Failed to fetch product details'));
      })
    );
  }

  addToCart(userId: string, productId: string) {
    return this.http.post(`${this.apiUrl}/user/${userId}`, { productId }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding item to cart:', error.message);
        return throwError(() => new Error('Failed to add item to cart'));
      })
    );
  }

  getCartByUser(userId: string) {
    return this.http.get(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user cart:', error.message);
        return throwError(() => new Error('Failed to fetch cart'));
      })
    );
  }

  // Add items to the cart (replace cart if already exists)
  /*   addCartItem(userId: string, cart: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${userId}`, cart).pipe(
      catchError((error) => {
        console.error('Error adding item to cart:', error);
        return throwError(() => new Error('Failed to add item to cart'));
      })
    );
  }

  // Add a product to the cart (updates existing cart or creates a new one)
  addToCart(userId: string, product: any): void {
    this.getCartItems(userId).subscribe((cart) => {
      const existingProduct = cart.products.find(
        (item: any) => item.product === product._id
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: product._id, quantity: 1 });
      }

      this.addCartItem(userId, cart).subscribe();
    });
  } */

  // Remove an item from the cart by userId and productId
  removeCartItem(userId: string, productId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${userId}/products/${productId}`)
      .pipe(
        catchError((error) => {
          console.error('Error removing cart item:', error);
          return throwError(() => new Error('Failed to remove cart item'));
        })
      );
  }

  // Fetch token from localStorage for userId
  fetchTokenFromLocalStorage(): string {
    return localStorage.getItem('accessToken') || '';
  }

  // Decode token to get userId
  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getUserId(): string {
    const token = this.fetchTokenFromLocalStorage();
    return this.decodeToken(token).userId;
  }

  // Update cart item by userId
  updateCartItem(userId: string, cart: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}`, cart).pipe(
      catchError((error) => {
        console.error('Error updating cart item:', error);
        return throwError(() => new Error('Failed to update cart item'));
      })
    );
  }
}
