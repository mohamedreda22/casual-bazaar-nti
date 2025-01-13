import { Component, OnInit } from '@angular/core';
import { Order } from '../interfaces/orderInterface';
import { OrdersService } from '../services/orders.service';
import { Product } from '../interfaces/productInterface';

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

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.ordersService.getOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
      this.prefetchProducts(orders);
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
