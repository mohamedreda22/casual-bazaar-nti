import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.css',
  standalone: false,
})
export class BestSellersComponent implements OnInit {
  bestSellersByCategory: any[] = [];
  products: any[] = [];
  timer: any;
  imageURL: string = '';
  categories: any[] = []; 

  constructor(private _productS: ProductService) {}


  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;
    this._productS.getProducts().subscribe((response: any) => {
    this.products = response;
    this.bestSellersByCategory = this.groupBestSellersByCategory();
    this.startTimer(); 
    });

    this._productS.getCategories().subscribe((response:any) => {
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
    this.timer = setInterval(() => {
      this.bestSellersByCategory.forEach((category) => {
        const maxIndex = category.chunks.length - 1;
        if (category.activeIndex < maxIndex) {
          this.next(category);
        } else {
          category.activeIndex = 0; 
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
