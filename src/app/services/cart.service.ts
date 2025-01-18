import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order } from '../interfaces/orderInterface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private productUrl = 'http://localhost:3000/products';
  private orderUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  // Fetch cart items
  getCartItems(userId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/user/${userId}`)
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            // Handle unauthorized error
            // console.error('Unauthorized access - possibly invalid token');
            // Optionally, you can redirect to login or refresh token
          }
          return this.handleError(err, 'Failed to fetch cart items');
        })
      );
  }

  // Fetch product details
  getProductById(productId: string): Observable<any> {
    return this.http
      .get(`${this.productUrl}/${productId}`)
      .pipe(
        catchError((err) =>
          this.handleError(err, 'Failed to fetch product details')
        )
      );
  }

  // Add item to cart
  addToCart(userId: string, productId: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user/${userId}`, { productId })
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            // Handle unauthorized error
            console.error('Unauthorized access - possibly invalid token');
            // Optionally, you can redirect to login or refresh token
          }
          return this.handleError(err, 'Failed to add item to cart');
        })
      );
  }

  // Remove item from cart
  removeCartItem(userId: string, productId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/user/${userId}/${productId}`)
      .pipe(
        catchError((err) => this.handleError(err, 'Failed to remove cart item'))
      );
  }

  // Update cart item
  updateCartItem(
    userId: string,
    item: { productId: string; quantity: number }
  ): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/user/${userId}`, item)
      .pipe(
        catchError((err) => this.handleError(err, 'Failed to update cart item'))
      );
  }

  // Clear cart
  clearCart(userId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError((err) => this.handleError(err, 'Failed to clear cart')));
  }

  // Fetch cart count
  getCartCount(userId: string): Observable<number> {
    return this.getCartItems(userId).pipe(
      map((response) => response?.products?.length || 0),
      catchError(() => of(0))
    );
  }

  // Create order
  createOrder(order: Order): Observable<Order> {
    if (!order || !order.items || order.items.length === 0) {
      console.error('Invalid order data:', order);
      return throwError(() => new Error('Invalid order data.'));
    }

    return this.http.post<Order>(`${this.orderUrl}`, order).pipe(
      catchError((error) => {
        console.error('Error creating order:', error);
        console.log('order: ', order);
        return throwError(
          () => new Error(error?.error?.message || 'Failed to create order.')
        );
      })
    );
  }

  // Handle errors
  private handleError(error: any, message: string): Observable<never> {
    // console.error(message, error);
    return throwError(() => new Error(message));
  }

  // Calculate total
  calculateTotal(cartItems: any[]): number {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  fetchTokenFromLocalStorage(): string {
    return localStorage.getItem('accessToken') || '';
  }
}
