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
  cartId: string = '1'; // Ideally, this should come from a session or local storage
  imgURL = 'http://localhost:3000/images/';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems(this.cartId).subscribe(
      (items) => {
        this.cartItems = items;
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

/*   updateQuantity(item: any, delta: number): void {
    if (item.quantity + delta >= 1) {
      const updatedItem = { ...item, quantity: item.quantity + delta };
      this.cartService.updateCartItem(this.cartId, updatedItem).subscribe(
        () => {
          item.quantity += delta;
        },
        (error) => {
          console.error('Error updating item quantity:', error);
        }
      );
    }
  } */

/*   removeProductFromCart(cartId: string, productId: string): void {
    this.cartService.removeCartItem(cartId, productId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter((item) => item.id !== productId);
      },
      (error) => {
        console.error('Error removing product:', error);
      }
    );
  } */

  calculateTotal(): number {
    const totalItemCost = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return totalItemCost + this.shippingCost;
  }

  checkout(): void {
    console.log('Proceeding to checkout...');
  }
}
