import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';
import { Category } from '../interfaces/categoryInterface';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: Product[] = [];
  users: User[] = [];
  categories: Category[] = [];
  currentSection: string = 'products'; // Default section

  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
    this.loadCategories();
  }

  // Switch between sections
  showSection(section: string): void {
    this.currentSection = section;
  }

  loadProducts(): void {
    this.adminDashboardService.getAllProducts().subscribe(
      products => {
        this.products = products;
        console.log('Loaded Products:', this.products);
      },
      error => console.error('Error loading products:', error)
    );
  }

  loadUsers(): void { 
    this.adminDashboardService.getAllUsers().subscribe(
      users => {
        this.users = users;
        console.log('Loaded Users:', this.users);
      },
      error => console.error('Error loading users:', error)
    );
  }

  loadCategories(): void { 
    this.adminDashboardService.getAllCategories().subscribe(
      categories => {
        this.categories = categories;
        console.log('Loaded Categories:', this.categories);
      },
      error => console.error('Error loading categories:', error)
    );
  }

  updateProduct(product: Product): void {
    this.adminDashboardService.updateProduct(product).subscribe(
      updatedProduct => {
        console.log('Product updated:', updatedProduct);
        this.loadProducts(); // Reload products after update
      },
      error => console.error('Error updating product:', error)
    );
  }

  deleteProduct(id: number): void {
    this.adminDashboardService.deleteProduct(id).subscribe(
      () => {
        console.log('Product deleted');
        this.loadProducts(); // Reload products after deletion
      },
      error => console.error('Error deleting product:', error)
    );
  }

  updateUser(user: User): void {
    this.adminDashboardService.updateUser(user).subscribe(
      updatedUser => {
        console.log('User updated:', updatedUser);
        this.loadUsers(); // Reload users after update
      },
      error => console.error('Error updating user:', error)
    );
  }

  deleteUser(id: number): void {
    this.adminDashboardService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted');
        this.loadUsers(); // Reload users after deletion
      },
      error => console.error('Error deleting user:', error)
    );
  }

  updateCategory(category: Category): void {
    this.adminDashboardService.updateCategory(category).subscribe(
      updatedCategory => {
        console.log('Category updated:', updatedCategory);
        this.loadCategories(); // Reload categories after update
      },
      error => console.error('Error updating category:', error)
    );
  }

  deleteCategory(id: number): void {
    this.adminDashboardService.deleteCategory(id).subscribe(
      () => {
        console.log('Category deleted');
        this.loadCategories(); // Reload categories after deletion
      },
      error => console.error('Error deleting category:', error)
    );
  }
}
