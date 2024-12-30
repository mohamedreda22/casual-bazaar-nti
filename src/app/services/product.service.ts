import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http :HttpClient) { }
  uploadURL = 'http://localhost:3000/images/';
  getProducts():Observable<any>{
    return this._http.get<any>('http://localhost:3000/products');
  }
  getCategories():Observable<any>{
    return this._http.get<any>('http://localhost:3000/categories');
  }
}
