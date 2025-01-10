import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';

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
  cartCount: number = 0;

  imageURL = 'http://localhost:3000/images/';
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.userId = this.cartService.getUserId();
    this.loadCartItems();
    this.updateCartCount();
  }

  // Load cart items
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

  // Load product details for each cart item
  private loadProductDetails(item: any): void {
    this.cartService.getProductById(item.product).subscribe({
      next: (productDetails) => {
        item.productDetails = productDetails;
        this.calculateTotal();
      },
      error: (err) => console.error(`Error loading product details:`, err),
    });
  }

  // Update cart count
  private updateCartCount(): void {
    this.cartService.getCartCount(this.userId).subscribe({
      next: (count) => (this.cartCount = count),
      error: (err) => console.error('Error fetching cart count:', err),
    });
  }

  // Update quantity
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

  // Remove item
  removeItem(productId: string): void {
    this.cartService.removeCartItem(this.userId, productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(
          (item) => item.product !== productId
        );
        this.calculateTotal();
        this.updateCartCount();
      },
      error: (err) => console.error('Error removing item:', err),
    });
  }

  // Clear cart
  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
        this.cartCount = 0;
        Swal.fire('Cart cleared successfully', '', 'success');
      },
      error: (err) => console.error('Error clearing cart:', err),
    });
  }

  // Calculate total
  private calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.productDetails?.price || '0');
      return total + price * item.quantity;
    }, 0);
  }

  // Checkout
  checkout(): void {
    if (!this.cartItems.length) {
      Swal.fire('Your cart is empty.', '', 'warning');
      return;
    }

    const orders = this.cartItems.map((item) => ({
      customer_id: this.userId, // Ensure this is a valid MongoDB ObjectID
      product_id: item.product, // Ensure this is a valid MongoDB ObjectID
      quantity: item.quantity, // Must be a number
      total_price: item.quantity * item.productDetails.price, // Must be a positive number
    }));

    console.log('Orders payload:', orders);

    orders.forEach((order) => {
      this.cartService.createOrder(order).subscribe(
        () => {
          console.log(
            `Order placed successfully for product ${order.product_id}.`
          );
          this.clearCart(); // Optionally clear cart after all requests succeed
          Swal.fire('Order placed successfully.', '', 'success');
        },
        (error) => {
          console.log('order failed', order);
          console.error('Order creation failed:', error);
          Swal.fire(
            'Failed to place the order.',
            error?.error?.message || '',
            'error'
          );
        }
      );
    });
  }

  sumTotal(): number {
    return this.totalPrice + this.shippingCost;
  }
}
