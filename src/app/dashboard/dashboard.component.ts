import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';
import { Category } from '../interfaces/categoryInterface';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentSection: string = 'products';
  products: Product[] = [];
  users: User[] = [];
  categories: Category[] = [];
  filteredSubCategories: string[] = [];

  isAddingProduct: boolean = false;
  newProduct: Product = this.initializeNewProduct();

  errorMessage: string | null = null;

  addProductForm: FormGroup;

  constructor(private adminDashboardService: AdminDashboardService) {
    this.addProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subCategory: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      productImage: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
    this.loadCategories();
  }

  showSection(section: string): void {
    this.currentSection = section;
  }

  initializeNewProduct(): Product {
    return {
      _id: '',
      name: '',
      price: 0,
      category: { main: '', subCategory: '' },
      description: '',
      productImage: '',
      bestSellers: false,
      rank: 0,
      status: { availability: 'available', stockStatus: 'inStock' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

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
      },
      (error) => console.error('Error loading users:', error)
    );
  }

  loadCategories(): void {
    this.adminDashboardService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => console.error('Error loading categories:', error)
    );
  }

  onCategoryChange(categoryId: string): void {
    const selectedCategory = this.categories.find(
      (category) => category._id === categoryId
    );
    this.filteredSubCategories = selectedCategory
      ? selectedCategory.subCategories
      : [];
    this.addProductForm.get('subCategory')?.setValue(''); // Reset subcategory when category changes
  }

  showAddProductForm(): void {
    this.isAddingProduct = true;
  }

  toggleAddProductForm(): void {
    this.isAddingProduct = !this.isAddingProduct;
  }

  cancelAddProduct(): void {
    this.isAddingProduct = false;
    this.newProduct = this.initializeNewProduct();
  }

  handleAddProduct(): void {
    if (this.addProductForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addProductForm.get('name')?.value);
      formData.append('price', this.addProductForm.get('price')?.value);
      formData.append('category', this.addProductForm.get('category')?.value);
      formData.append(
        'subCategory',
        this.addProductForm.get('subCategory')?.value
      );
      formData.append(
        'description',
        this.addProductForm.get('description')?.value
      );
      formData.append(
        'productImage',
        this.addProductForm.get('productImage')?.value
      );

      this.adminDashboardService.addProduct(formData).subscribe(
        (newProduct) => {
          console.log('Product added:', newProduct);
          this.loadProducts();
          this.isAddingProduct = false;
          this.newProduct = this.initializeNewProduct();
        },
        (error) => console.error('Error adding product:', error)
      );
    }
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addProductForm.patchValue({
        productImage: file,
      });
    }
  }

  updateProduct(product: Product): void {
    this.adminDashboardService.updateProduct(product).subscribe(
      (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
        this.loadProducts();
      },
      (error) => console.error('Error updating product:', error)
    );
  }

  deleteProduct(id: string): void {
    this.adminDashboardService.deleteProduct(id).subscribe(
      () => {
        console.log('Product deleted');
        this.loadProducts();
      },
      (error) => console.error('Error deleting product:', error)
    );
  }

  updateUser(user: User): void {
    this.adminDashboardService.updateUser(user).subscribe(
      (updatedUser) => {
        console.log('User updated:', updatedUser);
        this.loadUsers();
      },
      (error) => console.error('Error updating user:', error)
    );
  }

  deleteUser(id: string): void {
    this.adminDashboardService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted');
        this.loadUsers();
      },
      (error) => console.error('Error deleting user:', error)
    );
  }

  updateCategory(category: Category): void {
    this.adminDashboardService.updateCategory(category).subscribe(
      (updatedCategory) => {
        console.log('Category updated:', updatedCategory);
        this.loadCategories();
      },
      (error) => console.error('Error updating category:', error)
    );
  }

  deleteCategory(id: string): void {
    this.adminDashboardService.deleteCategory(id).subscribe(
      () => {
        console.log('Category deleted');
        this.loadCategories();
      },
      (error) => console.error('Error deleting category:', error)
    );
  }
}
