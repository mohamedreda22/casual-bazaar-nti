import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';
import { Order } from '../interfaces/orderInterface';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  shippingCost: number = 5;
  userId: string = '';
  totalPrice: number = 0;
  // cartCount: number = 0;

  imageURL = 'http://localhost:3000/images/';
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.userId = this.cartService.getUserId();
    this.loadCartItems();
    // this.updateCartCount();
  }

  private loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response) => {
        if (response?.products) {
          this.cartItems = response.products;
          this.cartItems.forEach((item) => this.loadProductDetails(item));
        }
      },
      error: (err) => console.error('Error loading cart:', err),
    });
  }

  private loadProductDetails(item: any): void {
    this.cartService.getProductById(item.product).subscribe({
      next: (productDetails) => {
        item.productDetails = productDetails;
        this.calculateTotal();
      },
      error: (err) => console.error('Error loading product details:', err),
    });
  }

  // private updateCartCount(): void {
  //   this.cartService.getCartCount(this.userId).subscribe({
  //     next: (count) => (this.cartCount = count),
  //     error: (err) => console.error('Error fetching cart count:', err),
  //   });
  // }

  updateQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    item.quantity = newQuantity;
    this.cartService
      .updateCartItem(this.userId, {
        productId: item.product,
        quantity: newQuantity,
      })
      .subscribe({
        next: () => this.calculateTotal(),
        error: (err) => console.error('Error updating cart item:', err),
      });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(this.userId, productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(
          (item) => item.product !== productId
        );
        this.calculateTotal();
        // this.updateCartCount();
      },
      error: (err) => console.error('Error removing item:', err),
    });
  }

  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
        // this.cartCount = 0;
        Swal.fire('Cart cleared successfully', '', 'success');
      },
      error: (err) => console.error('Error clearing cart:', err),
    });
  }

  clearCartAfterOrder(): void {
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
        // this.cartCount = 0;
      },
      error: (err) => console.error('Error clearing cart:', err),
    });
  }

  private calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.productDetails?.price || '0');
      return total + price * item.quantity;
    }, 0);
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire('Cart is empty.', 'Please add items to cart.', 'warning');
      return;
    }

    const orders: Order[] = [
      {
        _id: '',
        // order_id: this.generateUniqueId(),
        customer_id: this.userId,
        items: this.cartItems.map((item) => ({
          product_id: item.product,
          quantity: item.quantity,
        })),
        total_price: this.sumTotal(),
        // order_date: new Date(),
        status: 'Pending',
      },
    ];

    orders.forEach((order) => {
      this.cartService.createOrder(order).subscribe({
        next: () => {
          Swal.fire('Order placed successfully.', '', 'success');
          // this.updateCartCount();
          this.loadCartItems();
           this.clearCartAfterOrder();
        },
        error: (error) => {
          console.error('Order creation failed:', error);
          console.log('order failed from cart: ', order);
          console.log('cartItems: ', this.cartItems);
          Swal.fire('Failed to place order.', '', 'error');
        },
      });
    });
  }

sumTotal(): number {
  return Number(this.totalPrice) + Number(this.shippingCost);
}
}
