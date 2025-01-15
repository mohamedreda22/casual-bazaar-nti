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

  constructor(private _http: HttpClient) {}

  // Get all products from the database
  getAllProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Get all users from the database
  getAllUsers(): Observable<User[]> {
    return this._http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Get all categories from the database
  getAllCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Update a product in the database
  updateProduct(
    productId: string,
    updatedProduct: Product
  ): Observable<Product> {
    return this._http.put<Product>(
      `${this.apiUrl}/products/${productId}`,
      updatedProduct
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

  // Delete an order from the database
  deleteOrder(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/orders/${id}`);
  }

  // Update a category in the database
  updateCategory(categoryId: string, categoryData: Category): Observable<any> {
    return this._http.put(
      `${this.apiUrl}/categories/${categoryId}`,
      categoryData
    );
  }

  // Delete a category from the database
  deleteCategory(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  editCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this._http.put<Category>(
      `${this.apiUrl}/categories/${id}`,
      category
    );
  }

  // Add a new product to the database
  addProduct(addProductForm: FormData): Observable<Product> {
    return this._http.post<Product>(`${this.apiUrl}/products`, addProductForm);
  }

  // Add a new category
  addCategory(category: Partial<Category>): Observable<Category> {
    return this._http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  // get usertype
  getUserTypes(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/userTypes`);
  }

  addUserType(userType: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/userTypes`, userType);
  }

  getAllOrders() {
    return this._http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  updateOrder(order: Order) {
    return this._http.put(`${this.apiUrl}/orders/${order._id}`, order);
  }
  getProductById(productId: string): Observable<Product> {
    return this._http.get<Product>(`${this.apiUrl}/products/${productId}`);
  }

  getUserById(userId: string): Observable<User> { 
    return this._http.get<User>(`${this.apiUrl}/users/${userId}`);
}

}


