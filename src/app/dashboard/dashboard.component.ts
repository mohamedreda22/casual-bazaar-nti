import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';
// import { Order } from '../interfaces/orderInterface';
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
  // orders: Order[] = [];
  categories: Category[] = [];

  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
    // this.loadOrders();
    this.loadCategories();
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

  // loadOrders(): void { 
  //   this.adminDashboardService.getAllOrders().subscribe(
  //     orders => {
  //       this.orders = orders;
  //       console.log('Loaded Orders:', this.orders);
  //     },
  //     error => console.error('Error loading orders:', error)
  //   );
  // }

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

  // updateOrder(order: Order): void {
  //   this.adminDashboardService.updateOrder(order).subscribe(
  //     updatedOrder => {
  //       console.log('Order updated:', updatedOrder);
  //       this.loadOrders(); // Reload orders after update
  //     },
  //     error => console.error('Error updating order:', error)
  //   );
  // }

  // deleteOrder(id: number): void {
  //   this.adminDashboardService.deleteOrder(id).subscribe(
  //     () => {
  //       console.log('Order deleted');
  //       this.loadOrders(); // Reload orders after deletion
  //     },
  //     error => console.error('Error deleting order:', error)
  //   );
  // }

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
