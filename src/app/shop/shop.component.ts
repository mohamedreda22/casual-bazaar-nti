import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service'; // Import CartService
import Swal from 'sweetalert2';
import { AuthServiceService } from '../services/auth.service.service';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Shop Now!';
  timer: any;
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  carouselProducts: any[] = [];
  currentIndex = 0;
  selectedSubCategory: string | null = null;
  isAdmin: boolean = false;
  cartItems: any[] = []; // Track cart items

  @ViewChild('carouselTrack', { static: false })
  carouselTrack!: ElementRef<HTMLDivElement>;

  constructor(
    private _productS: ProductService,
    private _cartS: CartService, // Inject CartService
    private _authS: AuthServiceService // Inject AuthService
  ) {}

  imageURL = '';

  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;
    this._productS.getCategories().subscribe((response: any) => {
      this.categories = Array.isArray(response) ? response : [];
    });
    this._productS.getProducts().subscribe((response: any) => {
      this.products = response;
      this.filteredProducts = this.products;
      this.carouselProducts = [...this.products].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Also subscribe to isAdmin for admin-specific logic
      this._authS.isAdmin().subscribe({
        next: (isAdmin) => {
          this.isAdmin = isAdmin;
        },
        error: (err) => {
          console.error('Error checking admin status:', err);
        },
      });
    });
  }

  ngAfterViewInit(): void {
    this.updateCarousel();
    this.startTimer();
    window.addEventListener('resize', this.updateCarousel.bind(this));
  }

  ngOnDestroy(): void {
    this.stopTimer();
    window.removeEventListener('resize', this.updateCarousel.bind(this));
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

  startTimer(): void {
    this.timer = setInterval(() => {
      this.next();
    }, 3000);
  }

  stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  filterByCategory(categoryName: string, subCategory: string): void {
    this.selectedSubCategory = subCategory;
    this.filteredProducts = this.products.filter(
      (product) =>
        product.category === categoryName && product.subCategory === subCategory
    );
  }

  showDropdown(categoryName: string): void {
    this.categories.forEach((category) => (category.show = false));
    const selectedCategory = this.categories.find(
      (category) => category.name === categoryName
    );
    if (selectedCategory) {
      selectedCategory.show = true;
    }
  }

  hideDropdown(categoryName: string): void {
    const category = this.categories.find((c) => c.name === categoryName);
    if (category) {
      category.show = false;
    }
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  closeAllDropdowns(event: Event): void {
    if (!(event.target as HTMLElement).closest('.category-navbar')) {
      this.categories.forEach((category) => (category.show = false));
    }
  }

  // Handle checkout process (optional)
  checkout(): void {
    alert('Proceeding to checkout...');
  }

  // Add an item to the cart
  addToCart(product: any): void {
    this.fetchToken(); // Ensure the token is fetched and userId is set

    const userId = this.decodeToken(
      localStorage.getItem('accessToken') || ''
    ).userId;

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
        userId: userId,
        product: product._id,
        quantity: 1,
      });
    }

    // Send updated cart to backend
    this._cartS.addToCart(userId, product._id).subscribe(() => {
      // console.log('Added to cart:', product, userId);
    });
    Swal.fire({
      title: 'Success!',
      text: 'Product added to cart!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  fetchToken(): void {
    const token = this._cartS.fetchTokenFromLocalStorage();
    // Token fetching logic
  }

  decodeToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }

  // Show only the categories that have show = true in their attributes
  get visibleCategories(): any[] {
    return this.categories.filter((category) => category.show);
  }

  addToWishlist(productId: any): void {
    const userId = this.getUserId(); // Use the getUserId method here to fetch userId dynamically
    console.log('Adding to wishlist:', productId);
    this._productS.addToWishlist(productId, userId).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Product added to wishlist!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      error: (error) => {
        console.log('Error posting to wishlist', productId);
        console.error('Error adding to wishlist', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add product to wishlist.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  getUserId(): string {
    return this._cartS.getUserId();
  }
}
