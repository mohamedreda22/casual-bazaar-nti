import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/categoryInterface';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';
import { Order } from '../interfaces/orderInterface';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  apiUrl = 'http://localhost:3000';
  token = localStorage.getItem('accessToken');

  constructor(private _http: HttpClient) {}

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: this.token ? `Bearer ${this.token}` : '',
    };
  }

  // Get all products from the database
  getAllProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.apiUrl}/products`, {
      headers: this.getHeaders(),
    });
  }

  // Get all user types with authorization
  getAllUsers(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  // Get all categories from the database
  getAllCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(`${this.apiUrl}/categories`, {
      headers: this.getHeaders(),
    });
  }

  // Update a product in the database
  updateProduct(
    productId: string,
    updatedProduct: Product
  ): Observable<Product> {
    return this._http.put<Product>(
      `${this.apiUrl}/products/${productId}`,
      updatedProduct,
      { headers: this.getHeaders() }
    );
  }

  // Update a user in the database
  updateUser(userId:string,updatedUser: User): Observable<User> {
    return this._http.put<User>(`${this.apiUrl}/users/${userId}`, updatedUser, {
      headers: this.getHeaders(),
    });
  }

  // Delete an order from the database
  deleteOrder(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/orders/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Update a category in the database
  updateCategory(categoryId: string, categoryData: Category): Observable<any> {
    return this._http.put(
      `${this.apiUrl}/categories/${categoryId}`,
      categoryData,
      { headers: this.getHeaders() }
    );
  }

  // Delete a category from the database
  deleteCategory(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/categories/${id}`, {
      headers: this.getHeaders(),
    });
  }

  editCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this._http.put<Category>(
      `${this.apiUrl}/categories/${id}`,
      category,
      { headers: this.getHeaders() }
    );
  }

  // Add a new product to the database
  addProduct(addProductForm: FormData): Observable<Product> {
    const headers = {
      Authorization: this.token ? `Bearer ${this.token}` : '',
    };
    return this._http.post<Product>(`${this.apiUrl}/products`, addProductForm, {
      headers,
    });
  }

  // Add a new category
  addCategory(category: Partial<Category>): Observable<Category> {
    return this._http.post<Category>(`${this.apiUrl}/categories`, category, {
      headers: this.getHeaders(),
    });
  }

  // get usertype
  getUserTypes(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/userTypes`, {
      headers: this.getHeaders(),
    });
  }

  addUserType(userType: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/userTypes`, userType, {
      headers: this.getHeaders(),
    });
  }

  getAllOrders(): Observable<Order[]> {
    return this._http.get<Order[]>(`${this.apiUrl}/orders`, {
      headers: this.getHeaders(),
    });
  }

  updateOrder(order: Order) {
    return this._http.put(`${this.apiUrl}/orders/${order._id}`, order, {
      headers: this.getHeaders(),
    });
  }

  getProductById(productId: string): Observable<Product> {
    return this._http.get<Product>(`${this.apiUrl}/products/${productId}`, {
      headers: this.getHeaders(),
    });
  }

  getUserById(userId: string): Observable<User> {
    return this._http.get<User>(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  deleteUser(userId: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders(),
    });
  }
}
