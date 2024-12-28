import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import productsData from '../../assets/products.json';

@Component({
  selector: 'app-new-arrivals',
  imports: [CommonModule],
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css'],
})
export class NewArrivalsComponent {
  products: any = [];

  constructor() {
    this.products = productsData;
  }

  filter = 'newest';

  filterProducts(products: any) {
    return products.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addToCart(product: any) {
    console.log('Added to Cart:', product);
  }
}
