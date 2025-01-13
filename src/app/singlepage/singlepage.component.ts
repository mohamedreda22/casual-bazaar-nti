import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Product } from '../interfaces/productInterface';
import { ProductService } from '../services/product.service';
import { AuthServiceService } from '../services/auth.service.service';
import { CartService } from '../services/cart.service';
// import { Order } from '../interfaces/orderInterface';

@Component({
  selector: 'app-singlepage',
  standalone: false,
  templateUrl: './singlepage.component.html',
  styleUrls: ['./singlepage.component.css'],
})
export class SinglepageComponent implements OnInit {
  imageURL = 'http://localhost:3000/images/';
  title = 'singlepage';
  product: Product | undefined;
  cartItems: any[] = [];
  userId: string | null = null;

  constructor(
    private _productS: ProductService,
    private _route: ActivatedRoute,
    private _authS: AuthServiceService,
    private _cartS: CartService
  ) {}

  ngOnInit(): void {
    // Fetch the userId from auth service
    this.userId = this._authS.getUserId();

    // Fetch the productId from route params and fetch product details
    this._route.paramMap
      .pipe(
        switchMap((params) => {
          const productId = params.get('productId')!;
          return this.getProductById(productId);
        })
      )
      .subscribe((product) => {
        this.product = product;
      });
  }

  getProductById(productId: string): Observable<Product> {
    return this._productS.getProductById(productId);
  }

  calculateDiscount(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  addToCart(product: Product): void {
    if (!this.userId) {
      Swal.fire({
        title: 'Error!',
        text: 'Please login to add products to the cart.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Check if the product is already in the cart
    const existingProduct = this.cartItems.find(
      (item) => item.product === product._id
    );

    if (existingProduct) {
      // If the product exists, increase the quantity
      existingProduct.quantity += 1;
    } else {
      // Otherwise, add a new product to the cart
      this.cartItems.push({
        userId: this.userId,
        product: product._id,
        quantity: 1,
      });
    }

    // Send updated cart to backend
    this._cartS.addToCart(this.userId, product._id).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'Product added to cart!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    });
  }

//   checkout(): void {
// /*     if (this.cartItems.length === 0) {
//       Swal.fire('Cart is empty.', 'Please add items to the cart.', 'warning');
//       return;
//     }
//  */

    
//     if (!this.userId) {
//       Swal.fire({
//         title: 'Error!',
//         text: 'Please login to proceed with the checkout.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//       return;
//     }

//     // Validate that cart items have valid product data
//     const orderItems = this.cartItems.map((item) => ({
//       product_id: item.product,
//       quantity: item.quantity,
//       price: this.getProductPrice(item.product), // Make sure this returns valid prices
//     }));

//     // Ensure there are valid items before proceeding
//     if (
//       orderItems.some(
//         (item) => !item.product_id || !item.quantity || item.price <= 0
//       )
//     ) {
//       Swal.fire('Invalid order data.', 'Please check the cart items.', 'error');
//       return;
//     }

//     const totalPrice = this.sumTotal(orderItems);

//     // Ensure total price is valid
//     if (totalPrice <= 0) {
//       Swal.fire(
//         'Invalid order total.',
//         'Please check the prices of the items.',
//         'error'
//       );
//       return;
//     }

//     const orders: Order[] = [
//       {
//         _id: '',
//         customer_id: this.userId,
//         items: orderItems,
//         total_price: totalPrice,
//         status: 'Pending',
//       },
//     ];

//     orders.forEach((order) => {
//       this._cartS.createOrder(order).subscribe({
//         next: () => {
//           Swal.fire('Order placed successfully.', '', 'success');
//           this.clearCartAfterOrder();
//         },
//         error: (error) => {
//           console.error('Order creation failed:', error);
//           Swal.fire('Failed to place order.', '', 'error');
//         },
//       });
//     });
//   }

  sumTotal(orderItems: any[]): number {
    return orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  getProductPrice(productId: string): number {
    const product = this.cartItems.find((item) => item.product === productId);
    return product ? product.price : 0;
  }

  clearCartAfterOrder(): void {
    this.cartItems = [];
  }

}
