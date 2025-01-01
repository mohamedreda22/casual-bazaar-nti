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

  cartItems: any[] = []; // Track cart items

  @ViewChild('carouselTrack', { static: false })
  carouselTrack!: ElementRef<HTMLDivElement>;

  constructor(
    private _productS: ProductService,
    private _cartS: CartService // Inject CartService
  ) {}

  imageURL = '';

  ngOnInit(): void {
    this.imageURL = this._productS.uploadURL;
    this._productS.getCategories().subscribe((response) => {
      this.categories = response;
    });
    this._productS.getProducts().subscribe((response) => {
      this.products = response;
      this.filteredProducts = this.products;
      this.carouselProducts = [...this.products].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    this.loadCart(); // Load cart items
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
    console.log(`Filtering products for ${categoryName} > ${subCategory}`);
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

  // Add an item to the cart
  addToCart(product: any): void {
    this._cartS.addCartItem(product).subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
  }

  // Load the current cart items
  loadCart(): void {
    this._cartS.getCartItems().subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
  }

  // Remove item from the cart
  removeFromCart(productId: string): void {
    this._cartS.removeCartItem(productId).subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
  }

  // Handle checkout process (optional)
  checkout(): void {
    alert('Proceeding to checkout...');
  }
}
