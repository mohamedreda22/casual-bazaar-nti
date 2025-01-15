import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/productInterface';
import { Wishlist } from '../interfaces/wishlistInterface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http: HttpClient) {}
  uploadURL = 'http://localhost:3000/images/';
  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>('http://localhost:3000/products');
  }
  getCategories(): Observable<Product> {
    return this._http.get<Product>('http://localhost:3000/categories');
  }

  addToWishlist(productId: string,userId: string): Observable<Wishlist> {
    return this._http.post<Wishlist>('http://localhost:3000/wishlist', {
      productId,
      userId,
    });
  }
  getWishlistByUserId(userId: string): Observable<Wishlist> {
    return this._http.get<Wishlist>(`http://localhost:3000/wishlist/${userId}`);
  }
  removeFromWishlist(productId: string): Observable<Wishlist> {
    return this._http.delete<Wishlist>(
      `http://localhost:3000/wishlist/${productId}`
    );
  }

  getUserId(): string {
    const token = localStorage.getItem('accessToken');
    return token ? JSON.parse(atob(token.split('.')[1])).userId : '';
  }

  updateWishlist(wishlist: Wishlist): Observable<Wishlist> {
    return this._http.put<Wishlist>('http://localhost:3000/wishlist', wishlist);
  }

  getProductById(productId: string): Observable<Product> {
    return this._http.get<Product>(`http://localhost:3000/products/${productId}`);
  }
}
