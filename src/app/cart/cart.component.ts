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
  orderDetails: {
    fullName: string;
    address: string;
    city: string;
    government: string;
    extraPhone: string;
    payment: string;
  } = {
    fullName: '',
    address: '',
    city: '',
    government: '',
    extraPhone: '',
    payment: '',
  };
  shippingCost: number = 5;
  userId: string = '';
  totalPrice: number = 0;

  readonly imageURL = 'http://localhost:3000/images/';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.userId = this.cartService.getUserId();
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response) => {
        this.cartItems = response?.products || [];
        this.cartItems.forEach((item) => this.loadProductDetails(item));
      },
      error: () => Swal.fire('Failed to load cart items.', '', 'error'),
    });
  }

  private loadProductDetails(item: any): void {
    this.cartService.getProductById(item.product).subscribe({
      next: (productDetails) => {
        item.productDetails = productDetails;
        this.calculateTotal();
      },
      error: () => Swal.fire('Failed to load product details.', '', 'error'),
    });
  }

  updateQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      Swal.fire('Quantity cannot be less than 1.', '', 'warning');
      return;
    }

    item.quantity = newQuantity;
    this.cartService
      .updateCartItem(this.userId, {
        productId: item.product,
        quantity: newQuantity,
      })
      .subscribe({
        next: () => this.calculateTotal(),
        error: () => Swal.fire('Failed to update cart item.', '', 'error'),
      });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(this.userId, productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(
          (item) => item.product !== productId
        );
        this.calculateTotal();
      },
      error: () => Swal.fire('Failed to remove item from cart.', '', 'error'),
    });
  }

  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
        Swal.fire('Cart cleared successfully.', '', 'success');
      },
      error: () => Swal.fire('Failed to clear cart.', '', 'error'),
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

/*     if (!this.isOrderDetailsValid()) {
      Swal.fire('Please fill in all required fields.', '', 'warning');
      return;
    } */

    const order: Order = {
      _id: '',
      customer_id: this.userId,
      items: this.cartItems.map((item) => ({
        product_id: item.product,
        quantity: item.quantity,
      })),
      total_price: this.sumTotal(),
      status: 'Pending',
      orderDetails: { ...this.orderDetails },
    };

    this.cartService.createOrder(order).subscribe({
      next: () => {
        Swal.fire('Order placed successfully.', '', 'success');
        this.clearCart();
      },
      error: () => Swal.fire('Failed to place order.', '', 'error'),
    });
  }

/*   private isOrderDetailsValid(): boolean {
    return ['fullName', 'address', 'payment'].every(
      (field) => this.orderDetails[field]
    );
  }
 */
  sumTotal(): number {
    return this.totalPrice + this.shippingCost;
  }
}
