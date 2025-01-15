import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = 'http://localhost:3000/wishlist';

  constructor(private http: HttpClient) { }

  createWishlist(wishlist: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, wishlist);
  }

  getWishlist(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  addItemToWishlist(userId: string, item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${userId}/items`, item);
  }

  removeItemFromWishlist(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/items/${productId}`);
  }
}