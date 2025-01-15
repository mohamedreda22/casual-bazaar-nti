import { CartService } from './../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/productInterface';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../services/auth.service.service';

@Component({
  selector: 'app-new-arrivals',
  standalone: false,
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css'],
})
export class NewArrivalsComponent implements OnInit {
  products: Product[] = []; // Typed as Product array
  imageURL: string = '';
  userId: string = '';
  filter: string = 'newest'; // Default filter
  isAdmin: boolean = false;

  constructor(
    private _productS: ProductService,
    private _cart: CartService,
    private _authS: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;
    this._authS.isAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
    this.userId = this._authS.getUserId() || ''; 

    if (this.userId) {
      this._productS.getProducts().subscribe({
        next: (response: Product[]) => {
          this.products = this.filterProducts(response);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue fetching products. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }

  changeFilter(filter: string): void {
    this.filter = filter;
    this.products = this.filterProducts(this.products); // Reapply filter to already fetched products
  }

  filterProducts(products: Product[]): Product[] {
    switch (this.filter) {
      case 'newest':
        return products.sort(
          (a: Product, b: Product) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'price':
        return products.sort((a: Product, b: Product) => a.price - b.price);
      case 'rank':
        return products.sort((a: Product, b: Product) => a.rank - b.rank);
      default:
        return products;
    }
  }

  addToCart(product: Product): void {
    if (!this.userId) {
      Swal.fire({
        title: 'Error!',
        text: 'You need to log in to add items to the cart.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    this._cart.getCartItems(this.userId).subscribe({
      next: (cartItems: any) => {
        // Ensure it's an array if the response isn't
        if (!Array.isArray(cartItems)) {
          cartItems = [];
        }

        // Check if the product is already in the cart
        const existingProduct = cartItems.find(
          (item:any ) => item.product === product._id
        );

        if (existingProduct) {
          // If the product exists, increase the quantity
          existingProduct.quantity += 1;
        } else {
          // Otherwise, add a new product to the cart
          cartItems.push({
            userId: this.userId,
            product: product._id,
            quantity: 1,
          });
        }

        // Send updated cart to the backend
        this._cart.addToCart(this.userId, product._id).subscribe({
          next: () => {
            console.log('Added to cart:', product, this.userId);
            Swal.fire({
              title: 'Success!',
              text: 'Product added to cart!',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          error: (err) => {
            console.error('Error adding to cart:', err);
            Swal.fire({
              title: 'Error!',
              text: 'There was an issue adding the product to your cart. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue fetching your cart. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
