import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

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
  imageURL: string = '';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.imageURL = this.cartService.imgURL;
    this.userId = this.cartService.getUserId();
    this.loadCartItems();
  }

  // Load cart items for the user
  loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe(
      (response) => {
        if (response && Array.isArray(response.products)) {
          this.cartItems = response.products.map((item: any) => ({
            ...item,
            productDetails: null,
          }));
          this.cartItems.forEach((item) => this.loadProductDetails(item));
        } else {
          console.error('Unexpected cart data:', response);
        }
      },
      (error) => console.error('Error loading cart:', error)
    );
  }

  // Load product details for each item
  loadProductDetails(item: any): void {
    this.cartService.getProductById(item.product).subscribe(
      (productDetails) => {
        item.productDetails = productDetails;
        this.calculateTotal();
      },
      (error) => console.error('Error loading product details:', error)
    );
  }

  // Update the quantity of a product in the cart
  updateQuantity(item: any, change: number): void {
    console.log('Updating quantity:', item.product, change);
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return; // Prevent quantity below 1

    item.quantity = newQuantity;
  this.cartService
    .updateCartItem(this.userId, {
      productId: item.product,
      quantity: newQuantity,
    })
    .subscribe(
      () => this.loadCartItems(), // Reload cart to reflect updates
      (error) => console.error('Error updating cart:', error)
    );
  }

  // Remove an item from the cart
  removeItem(productId: string): void {
    this.cartService.removeCartItem(this.userId, productId).subscribe(
      () => this.loadCartItems(),
      (error) => console.error('Error removing item:', error)
    );
  }

  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe(
      () => {
        this.cartItems = [];
        this.totalPrice = 0;
        console.log('Cart cleared successfully.');
      },
      (error) => {
        console.error('Error clearing cart:', error);
        alert('Failed to clear the cart. Please try again.');
      }
    );
  }

  // Calculate the total price of the cart
  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return item.productDetails
        ? total + item.productDetails.price * item.quantity
        : total;
    }, 0);
  }

  // Proceed to checkout
  checkout(): void {
    console.log('Proceeding to checkout...');
  }
}
