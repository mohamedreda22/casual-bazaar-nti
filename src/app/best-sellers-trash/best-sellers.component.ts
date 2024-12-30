import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css'],
  standalone: false,
})
export class BestSellersComponent implements OnInit {
  categories: any[] = []; // Use categories for grouping best sellers
  products: any[] = [];
  imageURL: string = '';
  timer: any;

  constructor(private _productS: ProductService) {}

  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;

    // Fetch products and categories
    this._productS.getProducts().subscribe((response) => {
      this.products = response;
      // Once products are fetched, group them by category
      this.categories = this.groupBestSellersByCategory();
      this.startTimer(); // Start timer only after categories are loaded
    });

    this._productS.getCategories().subscribe((response) => {
      this.categories = response;
    });
  }

  groupBestSellersByCategory() {
    const grouped = this.products.reduce((acc, product) => {
      if (product.bestSellers) {
        // Only include best sellers
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
      }
      return acc;
    }, {} as Record<string, any[]>);

    return Object.keys(grouped).map((category) => ({
      name: category,
      chunks: this.chunkArray(grouped[category], 3),
      activeIndex: 0,
    }));
  }

  startTimer() {
    if (!this.categories || this.categories.length === 0) {
      return; // Ensure categories are loaded before starting the timer
    }

    this.timer = setInterval(() => {
      this.categories.forEach((category) => {
        // Ensure chunks are available before accessing length
        if (category.chunks && category.chunks.length) {
          const maxIndex = category.chunks.length - 1;
          if (category.activeIndex < maxIndex) {
            this.next(category);
          } else {
            category.activeIndex = 0;
          }
        }
      });
    }, 3000);
  }

  prev(category: any) {
    // Handle previous button click: move to previous chunk
    category.activeIndex = Math.max(0, category.activeIndex - 1);
  }

  next(category: any) {
    // Handle next button click: move to next chunk
    const maxIndex = category.chunks.length - 1;
    category.activeIndex = Math.min(maxIndex, category.activeIndex + 1);
  }

  chunkArray(array: any[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}
