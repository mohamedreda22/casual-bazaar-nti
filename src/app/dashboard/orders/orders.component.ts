import { AdminDashboardService } from './../../services/admin-dashboard.service';
import { Order } from './../../interfaces/orderInterface';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from './../../interfaces/productInterface';

@Component({
  selector: 'app-order1',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['../dashboard.component.css'],
})
export class Order1Component implements OnInit {
  orders: Order[] = [];
  isEditingOrder: boolean = false;
  currentOrder: Order | null = null;
  editOrderForm: FormGroup;
  products: { [key: string]: Product } = {}; // Cache for fetched products
  imageURL = 'http://localhost:3000/images/'; // Your API base URL

  constructor(
    private adminDashboardService: AdminDashboardService,
    private fb: FormBuilder
  ) {
    // Initialize the form with validation
    this.editOrderForm = this.fb.group({
      total_price: ['', [Validators.required]],
      items: ['', Validators.required], // Multiple items for the order
      status: ['', Validators.required], // Status field added for order update
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      government: ['', Validators.required],
      extraPhone: [''],
      payment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.adminDashboardService.getAllOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        this.prefetchProducts(orders);
      },
      (error) => {
        console.error('Error loading orders:', error);
        Swal.fire('Error', 'Failed to load orders', 'error');
      }
    );
  }

  prefetchProducts(orders: Order[]): void {
    const productIds = new Set(
      orders.flatMap((order) => order.items.map((item) => item.product_id))
    );

    productIds.forEach((productId) => {
      if (!this.products[productId]) {
        this.adminDashboardService.getProductById(productId).subscribe(
          (product: Product) => {
            this.products[productId] = product;
          },
          (error) => {
            console.error('Error fetching product:', error);
          }
        );
      }
    });
  }

  startEditOrder(order: Order): void {
    this.isEditingOrder = true;
    this.currentOrder = order;
    this.editOrderForm.setValue({
      total_price: order.total_price,
      items: order.items.map((item) => item.product_id), // Populate the form with selected items
      status: order.status,
      fullName: order.orderDetails.fullName,
      address: order.orderDetails.address,
      city: order.orderDetails.city,
      government: order.orderDetails.government,
      extraPhone: order.orderDetails.extraPhone,
      payment: order.orderDetails.payment,
    });
  }

  handleUpdateOrder(): void {
    if (this.editOrderForm.valid && this.currentOrder) {
      const updatedOrder: Order = {
        ...this.currentOrder,
        total_price: this.editOrderForm.value.total_price,
        items: this.editOrderForm.value.items.map((productId: string) => ({
          product_id: productId,
          quantity: 1, // Default quantity (can be updated as needed)
        })),
        status: this.editOrderForm.value.status,
        orderDetails: {
          fullName: this.editOrderForm.value.fullName,
          address: this.editOrderForm.value.address,
          city: this.editOrderForm.value.city,
          government: this.editOrderForm.value.government,
          extraPhone: this.editOrderForm.value.extraPhone,
          payment: this.editOrderForm.value.payment,
        },
      };

      this.adminDashboardService.updateOrder(updatedOrder).subscribe(
        (updatedOrder) => {
          this.loadOrders();
          Swal.fire('Success', 'Order updated successfully', 'success');
        },
        (error) => {
          console.error('Error updating order:', error);
          Swal.fire('Error', 'Failed to update order', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Please fill all fields correctly', 'error');
    }
  }

  cancelEditOrder(): void {
    this.isEditingOrder = false;
    this.currentOrder = null;
    this.editOrderForm.reset();
  }

  deleteOrder(id: string): void {
    this.adminDashboardService.deleteOrder(id).subscribe(
      () => {
        this.loadOrders();
        Swal.fire('Success', 'Order deleted successfully', 'success');
      },
      (error) => {
        console.error('Error deleting order:', error);
        Swal.fire('Error', 'Failed to delete order', 'error');
      }
    );
  }

  getProductById(productId: string): Product | null {
    return this.products[productId] || null;
  }
}
