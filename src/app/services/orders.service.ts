import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/orderInterface';
import { Product } from '../interfaces/productInterface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  cancelOrder(orderId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  completeOrder(orderId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${orderId}/complete`, {});
  }

  fetchProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`http://localhost:3000/products/${productId}`);
  }

  getOrdersByUserId(userId:string):Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }
}