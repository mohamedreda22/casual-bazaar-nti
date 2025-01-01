import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart'; // Base URL for the cart API

  constructor(private http: HttpClient) {}

  // Get cart items by cart ID
  getCartItems(cartId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${cartId}`);
  }

  // Add an item to the cart
/*   addCartItem(cartId: string, product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${cartId}/products`, product);
  } */
  addCartItem(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, product);
  }

  // Update an item in the cart
  /*   updateCartItem(cartId: string, updatedItem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${cartId}`, updatedItem);
  } */

  // Remove an item from the cart
  /*   removeCartItem(cartId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cartId}/products/${productId}`);
  } */
}
