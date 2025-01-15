import { CartService } from './../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/productInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-arrivals',
  standalone: false,
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css'],
})
export class NewArrivalsComponent implements OnInit {
  products: any[] = [];
  imageURL: string = '';
  userId: string = '';
  filter: string = 'newest'; // Default filter

  constructor(private _productS: ProductService, private _cart: CartService) {}

  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;
    this.userId = this._cart.getUserId();
    this._productS.getProducts().subscribe((response) => {
      this.products = this.filterProducts(response);
    });
  }

  changeFilter(filter: string) {
    this.filter = filter;
    this.products = this.filterProducts(this.products);
  }

  filterProducts(products: any) {
    switch (this.filter) {
      case 'newest':
        return products.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'price':
        return products.sort((a: any, b: any) => a.price - b.price);
      case 'rank':
        return products.sort((a: any, b: any) => a.rank - b.rank);
      default:
        return products;
    }
  }

  // Add an item to the cart
  addToCart(product: Product): void {
    this._cart.getCartItems(this.userId).subscribe((cartItems) => {
      if (!Array.isArray(cartItems)) {
        cartItems = []; // Ensure it's an array if the response isn't
      }

      // Check if the product is already in the cart
      const existingProduct = cartItems.find(
        (item: any) => item.product === product._id
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
      this._cart.addToCart(this.userId, product._id).subscribe(() => {
        console.log('Added to cart:', product, this.userId);
        Swal.fire({
          title: 'Success!',
          text: 'Product added to cart!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      });
    });
  }
}
