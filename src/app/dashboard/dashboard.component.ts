import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';
import { Category } from '../interfaces/categoryInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
  isAddingCategory: boolean = false;
  isEditingCategory: boolean = false;
  newProduct: Product = this.initializeNewProduct();
  newCategory: Category = this.initializeNewCategory();

  errorMessage: string | null = null;
  isEditingProduct: boolean = false;

  addProductForm: FormGroup;
  editProductForm: FormGroup;
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;

  currentProduct: Product | null = null;
  imageURL: string = '';
  constructor(private adminDashboardService: AdminDashboardService) {
    this.imageURL = adminDashboardService.apiUrl + '/images/';
    this.addProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subCategory: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      productImage: new FormControl('', [Validators.required]),
    });

    this.editProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subCategory: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      productImage: new FormControl(''),
    });

    this.addCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      subCategories: new FormControl([], [Validators.required]),
      show: new FormControl('', [Validators.required]),
    });

    this.editCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      subCategories: new FormControl([], [Validators.required]),
      show: new FormControl('', [Validators.required]),
    });
  }

  // Start editing product
  startEditProduct(product: Product): void {
    this.isEditingProduct = true;
    this.currentProduct = product;
    this.editProductForm.patchValue({
      name: product.name,
      price: product.price,
      /*       category: {
        main: product.category,
        subCategory: product.subCategory,
      }, */
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
    });
  }

  // Handle product update
  handleUpdateProduct(): void {
    if (this.editProductForm.valid) {
      this.adminDashboardService
        .updateProduct(this.currentProduct!._id, this.editProductForm.value)
        .subscribe((response) => {
          console.log('Product updated', response);
          this.isEditingProduct = false;
          this.loadProducts(); // Reload products list
          Swal.fire('Success', 'Product updated successfully', 'success');
        });
        Swal.fire('Error', 'Failed to update product', 'error');
    }
  }

  // Cancel editing product
  cancelEditProduct(): void {
    this.isEditingProduct = false;
    this.currentProduct = null;
  }

  handleUpdateCategory(): void {
    if (this.editCategoryForm.valid) {
      this.adminDashboardService
        .updateCategory(this.newCategory!._id, this.editCategoryForm.value)
        .subscribe((response) => {
          console.log('Category updated', response);
          this.isEditingCategory = false;
          this.loadCategories(); // Reload categories list
          Swal.fire('Success', 'Category updated successfully', 'success');
        });
        Swal.fire('Error', 'Failed to update category', 'error');
    }
  }

  // Cancel editing category
  cancelEditCategory(): void {
    this.isEditingCategory = false;
    this.newCategory = this.initializeNewCategory();
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
      category: '',
      subCategory: '',
      description: '',
      productImage: '',
      bestSellers: false,
      rank: 0,
      status: { availability: 'available', stockStatus: 'inStock' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  initializeNewCategory(): Category {
    return {
      _id: '',
      name: '',
      subCategories: [],
      show: true,
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

  showAddCategoryForm(): void {
    this.isAddingCategory = true;
  }

  toggleAddProductForm(): void {
    this.isAddingProduct = !this.isAddingProduct;
  }

  toggleAddCategoryForm(): void {
    this.isAddingCategory = !this.isAddingCategory;
  }

  cancelAddProduct(): void {
    this.isAddingProduct = false;
    this.newProduct = this.initializeNewProduct();
  }

  cancelAddCategory(): void {
    this.isAddingCategory = false;
    this.newCategory = this.initializeNewCategory();
  }

  handleAddProduct(): void {
    if (this.addProductForm.valid) {
      console.log('Form data:', this.addProductForm.value); // Debug here
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
          Swal.fire('Success', 'Product added successfully', 'success');
        },
        (error) => {console.error('Error adding product:', error)
        Swal.fire('Error', 'Failed to add product', 'error');
        }
      );
    }
  }

  handleAddCategory(): void {
    if (this.addCategoryForm.valid) {
      console.log('Form data:', this.addCategoryForm.value); // Debugging
      const formData = {
        name: this.addCategoryForm.get('name')?.value,
        subCategories: this.addCategoryForm.get('subCategories')?.value,
        show: this.addCategoryForm.get('show')?.value,
      };

      this.adminDashboardService.addCategory(formData).subscribe(
        (newCategory) => {
          console.log('Category added:', newCategory);
          this.loadCategories();
          this.isAddingCategory = false;
          this.newCategory = this.initializeNewCategory();
          Swal.fire('Success', 'Category added successfully', 'success');
        },
        (error) => {
          console.error('Error adding category:', error);
          Swal.fire('Error', 'Failed to add category', 'error');}
      );
    } else {
      console.error('Form invalid:', this.addCategoryForm.errors);
    }
  }

  loadUserTypes(): void {
    this.adminDashboardService.getUserTypes().subscribe(
      (userTypes) => {
        console.log('User types:', userTypes);
      },
      (error) => console.error('Error loading user types:', error)
    );
  }

  addUserType(): void {
    this.adminDashboardService.addUserType({}).subscribe(
      (response) => {
        console.log('User type added:', response);
      },
      (error) => console.error('Error adding user type:', error)
    );
  }

  getUserTypeName(userType: any): string {
    return userType.name;
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addProductForm.patchValue({
        productImage: file,
      });
      Swal.fire('Success', 'Image uploaded successfully', 'success');
    }
    else {
      Swal.fire('Error', 'Failed to upload image', 'error');
    }
  }

  updateProduct(product: Product): void {
    this.adminDashboardService.updateProduct(product._id, product).subscribe(
      (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
        this.loadProducts();
        Swal.fire('Success', 'Product updated successfully', 'success');
      },
      (error) => {console.error('Error updating product:', error)
      Swal.fire('Error', 'Failed to update product', 'error');
      }
    );
  }

  deleteProduct(id: string): void {
    this.adminDashboardService.deleteProduct(id).subscribe(
      () => {
        console.log('Product deleted');
        this.loadProducts();
        Swal.fire('Success', 'Product deleted successfully', 'success');
      },
      (error) => {console.error('Error deleting product:', error)
      Swal.fire('Error', 'Failed to delete product', 'error');
      }
    );
  }

  updateUser(user: User): void {
    this.adminDashboardService.updateUser(user).subscribe(
      (updatedUser) => {
        console.log('User updated:', updatedUser);
        this.loadUsers();
        Swal.fire('Success', 'User updated successfully', 'success');
      },
      (error) => {console.error('Error updating user:', error)
      Swal.fire('Error', 'Failed to update user', 'error');
      }
    );
  }

  deleteUser(id: string): void {
    this.adminDashboardService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted');
        this.loadUsers();
        Swal.fire('Success', 'User deleted successfully', 'success');
      },
      (error) => {console.error('Error deleting user:', error)
      Swal.fire('Error', 'Failed to delete user', 'error');
      }
    );
  }

  updateCategory(category: Category): void {
    this.adminDashboardService.updateCategory(category._id, category).subscribe(
      (updatedCategory) => {
        console.log('Category updated:', updatedCategory);
        this.loadCategories();
        Swal.fire('Success', 'Category updated successfully', 'success');
      },
      (error) => {console.error('Error updating category:', error)
      Swal.fire('Error', 'Failed to update category', 'error');
      }
    );
  }

  deleteCategory(id: string): void {
    this.adminDashboardService.deleteCategory(id).subscribe(
      () => {
        console.log('Category deleted');
        this.loadCategories();
        Swal.fire('Success', 'Category deleted successfully', 'success');
      },
      (error) => {console.error('Error deleting category:', error)
      Swal.fire('Error', 'Failed to delete category', 'error');
      }
    );
  }

  editCategory(category: Category): void {
    this.isEditingCategory = true;
    this.newCategory = category;
    this.editCategoryForm.patchValue({
      name: category.name,
      subCategories: category.subCategories.join(','),
      show: category.show,
    });
  }

  editUser(user: User): void {
    this.adminDashboardService.updateUser(user).subscribe(
      (updatedUser) => {
        console.log('User updated:', updatedUser);
        this.loadUsers();
      },
      (error) => {console.error('Error updating user:', error)
        Swal.fire('Error', 'Failed to update user', 'error');
      }
    );
  }
}
