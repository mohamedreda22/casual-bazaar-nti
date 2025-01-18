import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';
import { Order } from '../interfaces/orderInterface';
import { AuthServiceService } from '../services/auth.service.service';

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
  isLoading = false;

  orderForm: FormGroup;

  readonly imageURL = 'http://localhost:3000/images/';

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private _authS: AuthServiceService
  ) {
    // Initialize the reactive form
    this.orderForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      government: ['', Validators.required],
      extraPhone: ['', [Validators.pattern(/^[0-9]{11}$/)]],
      payment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this._authS.getUserId();
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response) => {
        this.cartItems = response?.products || [];
        this.cartItems.forEach((item) => this.loadProductDetails(item));
      },
      error: (error) => {
        let errorMsg =
          'Failed to load cart items. Please log in to view your cart.';
        console.error("Error", error?.status);
        if (error?.status === 401) {
          errorMsg = 'Please log in to view your cart.';
        }
        Swal.fire({
          title: 'Error!',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
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
        Swal.fire('Item removed from cart successfully.', '', 'success');
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
      error: (err) => {
        console.error('Error clearing cart:', err);
        Swal.fire('Failed to clear cart.', '', 'error');
      },
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

    if (this.orderForm.invalid) {
      Swal.fire('Please fill in all required fields correctly.', '', 'warning');
      return;
    }

    this.isLoading = true;
    const order: Order = {
      _id: '',
      customer_id: this.userId,
      items: this.cartItems.map((item) => ({
        product_id: item.product,
        quantity: item.quantity,
      })),
      total_price: this.sumTotal(),
      status: 'Pending',
      orderDetails: this.orderForm.value,
    };

    this.cartService.createOrder(order).subscribe({
      next: () => {
        Swal.fire('Order placed successfully.', '', 'success');
        this.cartItems = [];
      },
      error: () => Swal.fire('Failed to place order.', '', 'error'),
      complete: () => (this.isLoading = false),
    });
  }

  sumTotal(): number {
    return this.totalPrice + this.shippingCost;
  }
}
