import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/productInterface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http: HttpClient) {}
  uploadURL = 'http://localhost:3000/images/';
  getProducts(): Observable<Product> {
    return this._http.get<Product>('http://localhost:3000/products');
  }
  getCategories(): Observable<Product> {
    return this._http.get<Product>('http://localhost:3000/categories');
  }
}
