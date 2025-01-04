import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-new-arrivals',
  standalone: false,
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css'],
})
export class NewArrivalsComponent implements OnInit {
  products: any[] = [];
  imageURL: string = '';
  filter: string = 'newest'; // Default filter

  constructor(private _productS: ProductService) {}

  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;
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

  addToCart(product: any) {
    // console.log('Added to Cart:', product);
  }
}
