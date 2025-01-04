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
  imgURL = 'http://localhost:3000/images/';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.userId = this.cartService.getUserId();
    this.loadCartItems();
    if (this.cartItems) {
      this.calculateTotal();
    }
  }

  getUserId(): void {
    this.userId = this.cartService.getUserId();
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

    this.cartService.updateCartItem(this.userId, this.cartItems).subscribe(
      () => {
        this.loadCartItems(); // Reload cart items to reflect updated quantity
      },
      (error: any) => {
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

  productDetails(item: any): void {
    this.cartService.getProductById(item.product).subscribe(
      (productDetails) => {
        console.log('Product details:', productDetails);
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }
}
