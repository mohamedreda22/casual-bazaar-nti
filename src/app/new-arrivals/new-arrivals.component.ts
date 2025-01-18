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
  products: Product[] = [];
  imageURL: string = '';
  userId: string = '';
  filter: string = 'newest';
  isAdmin: boolean = false;

  // Pagination variables
  productsPerPage: number = 9;
  currentPage: number = 1;
  filteredProducts: Product[] = [];

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
          this.products = response.filter(
            (product: Product) => product.productStatus === 'active'
          );
          this.applyFiltersAndPagination(); // Apply initial filters and pagination
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

  applyFiltersAndPagination(): void {
    const filtered = this.getFilteredProducts(); // Filter products
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.filteredProducts = filtered.slice(startIndex, endIndex); // Paginate filtered products
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFiltersAndPagination(); // Reapply filters and pagination on page change
  }

  changeFilter(filter: string): void {
    this.filter = filter;
    this.currentPage = 1; // Reset to first page when filter changes
    this.applyFiltersAndPagination();
  }

  getFilteredProducts(): Product[] {
    // Apply sorting based on the selected filter
    switch (this.filter) {
      case 'newest':
        return this.products.sort(
          (a: Product, b: Product) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'price':
        return this.products.sort(
          (a: Product, b: Product) => a.price - b.price
        );
      case 'rank':
        return this.products.sort((a: Product, b: Product) => a.rank - b.rank);
      default:
        return this.products;
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

    this._cart.addToCart(this.userId, product._id).subscribe({
      next: () => {
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
  }
}
