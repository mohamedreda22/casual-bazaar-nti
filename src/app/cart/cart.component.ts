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
  userId = '605c72ef1532072e8c7f1dbb';
  imgURL = 'http://localhost:3000/images/';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCartItems(); 
    if (this.cartItems) {
      this.calculateTotal();
    }
  }

  loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe(
      (response) => {
        if (Array.isArray(response.products)) {
          this.cartItems = response.products;
          console.log('Cart Items:', this.cartItems);
          this.cartItems.forEach((item) => {
            console.log('Item:', item);
            this.cartService.getProductById(item.product).subscribe(
              (productDetails) => {
                item.productDetails = productDetails;
              },
              (error) => {
                console.error('Error fetching product details:', error);
              }
            );
          });
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  /*   calculateTotal(): number {
    const totalItemCost = this.cartItems.reduce(
      (total, item) => total + item.productDetails.price * item.quantity,
      0
    );
    return totalItemCost + this.shippingCost;
  } */
  calculateTotal() {
    return this.cartItems.reduce((total, item) => {
      if (item && item.price) {
        return total + item.price;
      } else {
        console.warn('Item or price is missing', item);
        return total;
      }
    }, 0);
  }

  checkout(): void {
    console.log('Proceeding to checkout...');
  }

  updateQuantity(item: any, change: number): void {
    item.quantity += change;

    if (item.quantity < 1) {
      item.quantity = 1; // Prevent negative or zero quantities
    }

    this.cartService.addCartItem(this.userId, this.cartItems).subscribe(
      () => {
        this.loadCartItems(); // Reload cart items to reflect updated quantity
      },
      (error) => {
        console.error('Error updating quantity:', error);
      }
    );
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(this.userId, productId).subscribe(
      () => {
        this.loadCartItems(); // Reload cart items after removal
      },
      (error) => {
        console.error('Error removing item:', error);
      }
    );
  }
}
