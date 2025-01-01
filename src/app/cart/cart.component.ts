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
  shippingCost: number = 5; // Assuming a fixed shipping cost for simplicity
  cartId: string = '1'; // Ideally, this should come from a session or local storage

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  // Fetch cart items from the service
  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (items) => {
        this.cartItems = items;
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }

    );
  }

  // Update item quantity when the user increases or decreases the quantity
  updateQuantity(item: any, delta: number): void {
    // Prevent negative quantities
    if (item.quantity + delta >= 1) {
      const updatedItem = { ...item, quantity: item.quantity + delta };
      this.cartService.updateCartItem(this.cartId, updatedItem).subscribe(
        () => {
          item.quantity += delta; // Update the quantity in the local cart state
        },
        (error) => {
          console.error('Error updating item quantity:', error);
        }
      );
    }
  }

  // Remove product from the cart
  removeProductFromCart(cartId: string, productId: string): void {
    this.cartService.removeCartItem(productId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter((item) => item.id !== productId);
      },
      (error) => {
        console.error('Error removing product:', error);
      }
    );
  }

  // Calculate the total price of all items in the cart
  calculateTotal(): number {
    const totalItemCost = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return totalItemCost + this.shippingCost; // Adding shipping cost to the total
  }

  // Handle the checkout process
  checkout(): void {
    console.log('Proceeding to checkout...');
    // Implement checkout logic here (e.g., redirect to a checkout page)
  }
}
