import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import productsData from '../../assets/products.json';

@Component({
  selector: 'app-new-arrivals',
  imports: [CommonModule],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
})
export class NewArrivalsComponent {
  
  products: any = [];

  constructor() {
    this.products = productsData;
  }

  // Add a product to the cart
  addToCart(product: any) {
    console.log(product);
  }

  // Remove a product from the cart
  removeFromCart(product: any) {
    console.log(product);
  }

  // Filter products by category
  filterProducts(category: string) {
    console.log(category);
  }

  // Sort products by price
  sortProducts(sortBy: string) {
    console.log(sortBy);
  }

  // Search products by name
  searchProducts(searchTerm: string) {
    console.log(searchTerm);
  }

  // Get product details
  getProductDetails(productId: string) {
    console.log(productId);
  }
  
}
