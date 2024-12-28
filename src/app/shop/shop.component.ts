import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener } from '@angular/core';

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
  products = [
    {
      image: 'camera.webp',
      title: 'Digital Camera',
      desc: 'High resolution digital camera with 4K video recording',
      price: 599,
      category: 'Men',
      subCategory: 'Shirts',
    },
    {
      image: 'earbods.webp',
      title: 'Wireless Earbuds',
      desc: 'True wireless earbuds with noise cancellation',
      price: 199,
      category: 'Women',
      subCategory: 'Shoes',
    },
    {
      image: 'ipad.webp',
      title: 'iPad Pro',
      desc: 'Latest iPad Pro with M1 chip and Liquid Retina display',
      price: 799,
      category: 'Kids',
      subCategory: 'Hoodies',
    },
    {
      image: 'iphone.jpg',
      title: 'iPhone 14 Pro',
      desc: 'Latest iPhone with pro camera system and A16 chip',
      price: 999,
      category: 'Men',
      subCategory: 'Shoes',
    },
    {
      image: 'laptop.jpg',
      title: 'MacBook Pro',
      desc: '14-inch MacBook Pro with M2 chip and Retina display',
      price: 1299,
      category: 'Kids',
      subCategory: 'Toys',
    },
  ];

  carouselProducts = [
    {
      image: 'camera.webp',
      title: 'Digital Camera',
      desc: 'High resolution digital camera with 4K video recording',
      price: 599,
    },
    {
      image: 'earbods.webp',
      title: 'Wireless Earbuds',
      desc: 'True wireless earbuds with noise cancellation',
      price: 199,
    },
    {
      image: 'ipad.webp',
      title: 'iPad Pro',
      desc: 'Latest iPad Pro with M1 chip and Liquid Retina display',
      price: 799,
    },
    {
      image: 'iphone.jpg',
      title: 'iPhone 14 Pro',
      desc: 'Latest iPhone with pro camera system and A16 chip',
      price: 999,
    },
    {
      image: 'laptop.jpg',
      title: 'MacBook Pro',
      desc: '14-inch MacBook Pro with M2 chip and Retina display',
      price: 1299,
    },
    {
      image: 'speaker.webp',
      title: 'Smart Speaker',
      desc: 'Wireless smart speaker with voice assistant',
      price: 299,
    },
    {
      image: 'watch.webp',
      title: 'Smart Watch',
      desc: 'Fitness tracker with heart rate monitoring',
      price: 249,
    },
    {
      image: 'tv.webp',
      title: '4K Smart TV',
      desc: '55-inch 4K UHD Smart TV with HDR',
      price: 899,
    },
  ];
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
    this.products = this.products.filter(
      (product) =>
        product.category === categoryName && product.subCategory === subCategory
    );
  }

  /*   showDropdown(categoryName: string): void {
  const category = this.categories.find((c) => c.name === categoryName);
  if (category) {
    category.show = true;
  }
} */

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
