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

  constructor(private cartService: CartService) {}
  imageURL = '';

  ngOnInit() {
  if (this.cartService.imgURL) {
    this.imageURL = this.cartService.imgURL;
  } else {
    console.error('Image URL is not defined in CartService');
  }    this.userId = this.cartService.getUserId();
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
          // console.log('Cart Items:', this.cartItems);
          this.cartItems.forEach((item) => {
            // console.log('Item:', item);
            this.cartService.getProductById(item.product).subscribe(
              (productDetails) => {
                item.productDetails = productDetails;
                // console.log('Product details:', productDetails);
                this.calculateTotal();
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
        this.calculateTotal(); // Recalculate total after quantity update
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

  productDetails(item: any): void {
    this.cartService.getProductById(item.product).subscribe(
      (productDetails) => {
        // console.log('Product details:', productDetails);
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      if (item && item.productDetails && item.productDetails.price) {
        return total + item.productDetails.price * item.quantity;
      } /* else {
        console.warn('Item or price is missing', item);
        return total;
      } */
    }, 0);
  }
}
