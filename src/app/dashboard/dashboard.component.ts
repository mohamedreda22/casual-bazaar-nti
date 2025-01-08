import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';
import { Category } from '../interfaces/categoryInterface';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  users: User[] = [];
  categories: Category[] = [];
  currentSection: string = 'categories'; // Default section

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
    this.loadCategories();
  }

  // Switch between sections
  showSection(section: string): void {
    this.currentSection = section;
  }

  errorMessage: string | null = null;

  loadProducts(): void {
    this.adminDashboardService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
      }
    );
  }

  loadUsers(): void {
    this.adminDashboardService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        console.log('Loaded Users:', this.users);
      },
      (error) => console.error('Error loading users:', error)
    );
  }

  loadCategories(): void {
    this.adminDashboardService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
        console.log('Loaded Categories:', this.categories);
      },
      (error) => console.error('Error loading categories:', error)
    );
  }

  updateProduct(product: Product): void {
    this.adminDashboardService.updateProduct(product).subscribe(
      (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
        this.loadProducts(); // Reload products after update
      },
      (error) => console.error('Error updating product:', error)
    );
  }

  deleteProduct(id: string): void {
    this.adminDashboardService.deleteProduct(id).subscribe(
      () => {
        console.log('Product deleted');
        this.loadProducts(); // Reload products after deletion
      },
      (error) => console.error('Error deleting product:', error)
    );
  }

  updateUser(user: User): void {
    this.adminDashboardService.updateUser(user).subscribe(
      (updatedUser) => {
        console.log('User updated:', updatedUser);
        this.loadUsers(); // Reload users after update
      },
      (error) => console.error('Error updating user:', error)
    );
  }

  deleteUser(id: string): void {
    this.adminDashboardService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted');
        this.loadUsers(); // Reload users after deletion
      },
      (error) => console.error('Error deleting user:', error)
    );
  }

  updateCategory(category: Category): void {
    this.adminDashboardService.updateCategory(category).subscribe(
      (updatedCategory) => {
        console.log('Category updated:', updatedCategory);
        this.loadCategories(); // Reload categories after update
      },
      (error) => console.error('Error updating category:', error)
    );
  }

  deleteCategory(id: string): void {
    this.adminDashboardService.deleteCategory(id).subscribe(
      () => {
        console.log('Category archived');
        this.loadCategories(); // Reload categories after deletion
      },
      (error) => console.error('Error deleting category:', error)
    );
  }

  showAddProductForm(): void {
    this.adminDashboardService
      .addProduct({
        _id: '',
        name: 'New Product',
        price: 0,
        category: {
          main: 'New Category',
          subCategory: 'New Subcategory',
        },
        description: 'New Product Description',
        imgURL: 'https://via.placeholder.com/150',
        bestSellers: false,
        rank: 0,
        status: {
          availability: 'available',
          stockStatus: 'inStock',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .subscribe(
        (newProduct) => {
          console.log('Product added:', newProduct);
          this.loadProducts(); // Reload products after addition
        },
        (error) => console.error('Error adding product:', error)
      );
  }

  showAddCategoryForm():void{
    this.adminDashboardService
    .addCategory
  }
}
