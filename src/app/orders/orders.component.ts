import { catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Order } from '../interfaces/orderInterface';
import { OrdersService } from '../services/orders.service';
import { Product } from '../interfaces/productInterface';
import { AuthServiceService } from '../services/auth.service.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  products: { [key: string]: Product } = {}; // Cache for fetched products
  imgURL = 'http://localhost:3000/images/';
  userId: string = '';

  constructor(
    private ordersService: OrdersService,
    private _authS: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.userId = this._authS.getUserId();
    if (!this.userId) {
      console.error('User ID is missing. Ensure the user is logged in.');
      return; // Prevent the fetchOrders call if userId is missing
    }
    this.fetchOrders();
  }

  private fetchOrders(): void {
    if (!this.userId) {
      console.error('User ID is missing');
      return;
    }

    this.ordersService.getOrdersByUserId(this.userId).subscribe({
      next: (response) => {
        this.orders = Array.isArray(response) ? response : [response];
        this.orders.forEach((item) => this.loadOrderDetails(item));
        console.log('orders: ', this.orders);
      },
      error: (err) => console.error('Error loading order:', err),
    });
  }

  private loadOrderDetails(item: any): void {
    item.items.forEach((orderItem: any) => {
      if (!this.products[orderItem.product_id]) {
        this.ordersService
          .fetchProductById(orderItem.product_id)
          .subscribe((product: Product) => {
            this.products[orderItem.product_id] = product;
          });
      }
    });
  }

  cancelOrder(orderId: string): void {
    this.ordersService.cancelOrder(orderId).subscribe(() => {
      this.fetchOrders();
    });
  }

  prefetchProducts(orders: Order[]): void {
    const productIds = new Set(
      orders.flatMap((order) => order.items.map((item) => item.product_id))
    );

    productIds.forEach((productId) => {
      if (!this.products[productId]) {
        this.ordersService
          .fetchProductById(productId)
          .subscribe((product: Product) => {
            this.products[productId] = product;
          });
      }
    });
  }

  getProduct(productId: string): Product | null {
    return this.products[productId] || null;
  }
}
