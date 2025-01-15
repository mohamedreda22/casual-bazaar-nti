import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../services/auth.service.service';
import { WishlistService } from '../services/wishlist.service';
import { Product } from '../interfaces/productInterface';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Shop Now!';
  categories: any[] = [];
  products: Product[] = [];
  filteredProducts: any[] = [];
  carouselProducts: any[] = [];
  currentIndex = 0;
  selectedSubCategory: string | null = null;
  isAdmin: boolean = false;
  userId: string = '';
  timer: any; // Timer property to store the interval ID

  @ViewChild('carouselTrack', { static: false })
  carouselTrack!: ElementRef<HTMLDivElement>;

  constructor(
    private _productS: ProductService,
    private _wishlistS: WishlistService,
    private _cartS: CartService,
    private _authS: AuthServiceService
  ) {}

  imageURL = '';

  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;
    this.userId = this._authS.getUserId();

    this._productS.getCategories().subscribe((response: any) => {
      this.categories = Array.isArray(response)
        ? response.filter((category: any) => category.show === true)
        : [];
    });

    this._productS.getProducts().subscribe((response: any) => {
      this.products = response;
      this.filteredProducts = this.products;
      this.carouselProducts = this.products
        .filter((product) => product.carousel)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    this._authS.isAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  ngAfterViewInit(): void {
    this.updateCarousel();
    window.addEventListener('resize', this.updateCarousel.bind(this));

    // Start the carousel timer when the component is initialized
    this.startCarouselTimer();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateCarousel.bind(this));

    // Clear the timer when the component is destroyed
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateCarousel(): void {
    const track = this.carouselTrack.nativeElement;
    const items = Array.from(track.children) as HTMLElement[];
    if (items.length > 0) {
      const itemWidth = items[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${this.currentIndex * itemWidth}px)`;
    }
  }

  next(): void {
    const items = this.carouselTrack.nativeElement.children;
    this.currentIndex = (this.currentIndex + 1) % items.length;
    this.updateCarousel();
  }

  prev(): void {
    const items = this.carouselTrack.nativeElement.children;
    this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
    this.updateCarousel();
  }

  onApplyFilter(filters: any): void {
    const [minPrice, maxPrice] = filters.priceRange
      ? filters.priceRange.split('-').map(Number)
      : [null, null];

    this.filteredProducts = this.products.filter((product: Product) => {
      const matchesName = filters.name
        ? product.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchesCategory = filters.category
        ? product.category === filters.category
        : true;
      const matchesPrice =
        minPrice !== null && maxPrice !== null
          ? product.price >= minPrice && product.price <= maxPrice
          : true;
      const matchesAvailability = filters.availability
        ? product.status?.availability === filters.availability
        : true;
      const matchesStockStatus = filters.stockStatus
        ? product.status?.stockStatus === filters.stockStatus
        : true;

      return (
        matchesName &&
        matchesCategory &&
        matchesPrice &&
        matchesAvailability &&
        matchesStockStatus
      );
    });
  }

  onResetFilter(): void {
    this.filteredProducts = [...this.products];
  }

  addToCart(product: any): void {
    this._cartS.addToCart(this.userId, product._id).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'Product added to cart!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    });
  }

  addToWishlist(product: any): void {
    this._wishlistS.addItemToWishlist(this.userId, product).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Product added to wishlist!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      error: (error) => {
        let errorMsg = 'Failed to add product to wishlist.';
        if (error.status === 401) {
          errorMsg = 'Please log in to add to wishlist.';
        } else if (error.status === 409) {
          errorMsg = 'Product already in wishlist.';
        }
        Swal.fire({
          title: 'Error!',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  // Function to start the carousel timer
  startCarouselTimer(): void {
    this.timer = setInterval(() => {
      this.next();
    }, 3000); // Change the value to control the interval (e.g., 3000ms = 3 seconds)
  }
}
