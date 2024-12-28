import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import productsData from '../../assets/products.json';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Shop Now!';
  timer: any;
  products = productsData;
  filteredProducts = this.products; // Initialize with all products

  carouselProducts = this.products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  currentIndex = 0;

  @ViewChild('carouselTrack', { static: false })
  carouselTrack!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {}

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

  categories = [
    {
      name: 'Men',
      subCategories: ['Shirts', 'Shoes', 'Suits', 'Accessories'],
      show: false,
    },
    {
      name: 'Women',
      subCategories: ['Dresses', 'Heels', 'Handbags', 'Accessories'],
      show: false,
    },
    {
      name: 'Kids',
      subCategories: ['T-shirts', 'Sneakers', 'Toys', 'Backpacks'],
      show: false,
    },
  ];

  filterByCategory(categoryName: string, subCategory: string): void {
    console.log(`Filtering products for ${categoryName} > ${subCategory}`);
    this.filteredProducts = this.products.filter(
      (product) =>
        product.category === categoryName && product.subCategory === subCategory
    );
  }

  showDropdown(categoryName: string): void {
    // Hide all other dropdowns
    this.categories.forEach((category) => {
      category.show = category.name === categoryName;
    });
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
}
