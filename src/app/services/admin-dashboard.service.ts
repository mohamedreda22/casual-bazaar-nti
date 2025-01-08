import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/categoryInterface';
// import { Order } from '../interfaces/orderInterface';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:3000'; // Your API base URL

  constructor(private _http: HttpClient) {}

  // Get all products from the database
  getAllProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Get all users from the database
  getAllUsers(): Observable<User[]> {
    return this._http.get<User[]>(`${this.apiUrl}/users`);
  }

  // // Get all orders from the database
  // getAllOrders(): Observable<Order[]> {
  //   return this._http.get<Order[]>(`${this.apiUrl}/orders`);
  // }

  // Get all categories from the database
  getAllCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Update a product in the database
  updateProduct(product: Product): Observable<Product> {
    return this._http.put<Product>(
      `${this.apiUrl}/products/${product._id}`,
      product
    );
  }

  // Delete a product from the database
  deleteProduct(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // Update a user in the database
  updateUser(user: User): Observable<User> {
    return this._http.put<User>(`${this.apiUrl}/users/${user._id}`, user);
  }

  // Delete a user from the database
  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // // Update an order in the database
  // updateOrder(order: Order): Observable<Order> {
  //   return this._http.put<Order>(`${this.apiUrl}/orders/${order.id}`, order);
  // }

  // Delete an order from the database
  deleteOrder(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/orders/${id}`);
  }

  // Update a category in the database
  updateCategory(category: Category): Observable<Category> {
    return this._http.put<Category>(
      `${this.apiUrl}/categories/${category._id}`,
      category
    );
  }

  // Delete a category from the database
  deleteCategory(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Add a new product to the database
  addProduct(product: Product): Observable<Product> {
    return this._http.post<Product>(`${this.apiUrl}/products`, product);
  }

  // Add a new category
  addCategory(category: Category): Observable<Category>{
    return this._http.post<Category>(`${this.apiUrl}/categories`,category);
  }
}
