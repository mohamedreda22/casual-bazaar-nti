import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { Product } from '../interfaces/productInterface';
import { User } from '../interfaces/userInterface';
import { Category } from '../interfaces/categoryInterface';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  currentCategory: Category | null = null;
  imageURL: string = '';
  constructor(
    private adminDashboardService: AdminDashboardService,
    private fb: FormBuilder
  ) {
    this.imageURL = adminDashboardService.apiUrl + '/images/';
    /*     this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      description: ['', Validators.required],
      bestSellers: [false, Validators.required],
      productImage: [null, Validators.required],
      status: this.fb.group({
        availability: ['', Validators.required], // Nested controls
        stockStatus: ['', Validators.required],
      }),
    }); */

    this.addProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subCategory: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      // bestSellers: new FormControl('', [Validators.required]),
      // rank: new FormControl('', [Validators.required]),
      // status: new FormGroup({
      //   availability: new FormControl('', [Validators.required]),
      //   stockStatus: new FormControl('', [Validators.required]),
      // }),
      productImage: new FormControl('', [Validators.required]),
    });

    this.editProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subCategory: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      // bestSellers: new FormControl(''),
      // rank: new FormControl(''),
      // status: new FormGroup({
      //   availability: new FormControl(''),
      //   stockStatus: new FormControl(''),
      // }),
      productImage: new FormControl(''),
    });

    this.addCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      subCategories: new FormControl([], [Validators.required]),
      show: new FormControl('', [Validators.required]),
    });

    this.editCategoryForm = this.fb.group({
      name: ['', [Validators.required]], // Category name field
      subCategories: this.fb.array([]), // Subcategories array
      show: ['', [Validators.required]], // Show dropdown field
    });
  }

  get subCategories(): FormArray {
    return this.editCategoryForm.get('subCategories') as FormArray;
  }

  // Add a new subcategory to the FormArray
  addSubCategory(value: string): void {
    if (value.trim()) {
      this.subCategories.push(
        this.fb.control(value.trim(), Validators.required)
      );
    }
  }

  removeSubCategory(index: number): void {
    this.subCategories.removeAt(index);
  }

  // Start editing product
  startEditProduct(product: Product): void {
    this.isEditingProduct = true;
    this.currentProduct = product;
    this.editProductForm.patchValue({
      name: product.name,
      price: product.price,
      category: product.category,
      subCategory: product.subCategory,
      bestSellers: product.bestSellers,
      rank: product.rank,
      status: {
        availability: product.status.availability,
        stockStatus: product.status.stockStatus,
      },
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

  startEditCategory(category: Category): void {
    this.isEditingCategory = true; // Open the edit form
    this.currentCategory = category; // Set the current category
    this.editCategoryForm.patchValue({
      name: category.name,
      subCategories: category.subCategories || [],
      show: category.show,
    });

    // Clear and repopulate the subCategories FormArray if needed
    this.subCategories.clear();
    category.subCategories.forEach((subCategory) => {
      this.subCategories.push(
        this.fb.control(subCategory, Validators.required)
      );
    });
  }

  handleUpdateCategory(): void {
    if (this.editCategoryForm.valid) {
      console.log('Form data:', this.editCategoryForm.value); // Debugging
      const updatedCategory = {
        ...this.newCategory, // Use the existing category details
        ...this.editCategoryForm.value, // Merge with form changes
      };
      const categoryId = this.currentCategory
        ? this.currentCategory._id
        : updatedCategory._id;
      console.log('updatedCategory ID :', categoryId);

      this.adminDashboardService
        .updateCategory(categoryId, updatedCategory)
        .subscribe({
          next: (response) => {
            console.log('Category updated successfully:', response);
            this.loadCategories(); // Reload categories to reflect changes
            Swal.fire('Success', 'Category updated successfully', 'success');
            this.cancelEditCategory(); // Reset form and UI
          },
          error: (error) => {
            console.error('Error updating category:', error);
            Swal.fire(
              'Error',
              'Failed to update category. Please try again.',
              'error'
            );
          },
        });
    } else {
      console.error('Form is invalid:', this.editCategoryForm.errors);
      Swal.fire(
        'Error',
        'Please correct the errors in the form and try again.',
        'error'
      );
    }
  }

  // Cancel editing category
  cancelEditCategory(): void {
    this.isEditingCategory = false;
    this.editCategoryForm.reset(); // Clear form controls
    this.newCategory = this.initializeNewCategory(); // Reinitialize the category
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
      console.log('Form data:', this.addProductForm.value); // Debugging step

      const formData = new FormData();

      // Append top-level form controls
      formData.append('name', this.addProductForm.get('name')?.value || '');
      formData.append('price', this.addProductForm.get('price')?.value || '');
      formData.append(
        'category',
        this.addProductForm.get('category')?.value || ''
      );
      formData.append(
        'subCategory',
        this.addProductForm.get('subCategory')?.value || ''
      );
/*       formData.append(
        'bestSellers',
        this.addProductForm.get('bestSellers')?.value || 'false'
      ); */
      formData.append('rank', this.addProductForm.get('rank')?.value || '');
      formData.append(
        'description',
        this.addProductForm.get('description')?.value || ''
      );

      // Handle nested form controls in 'status'
      const statusGroup = this.addProductForm.get('status');
/*       if (statusGroup) {
        formData.append(
          'availability',
          statusGroup.get('availability')?.value || ''
        );
        formData.append(
          'stockStatus',
          statusGroup.get('stockStatus')?.value || ''
        );
      } */

      // Handle file input for 'productImage'
      const productImage = this.addProductForm.get('productImage')?.value;
      if (productImage) {
        formData.append('productImage', productImage);
      }

      // Call service to add product
      this.adminDashboardService.addProduct(formData).subscribe(
        (newProduct) => {
          console.log('Product added:', newProduct);
          this.loadProducts(); // Refresh the product list
          this.isAddingProduct = false; // Reset the adding state
          this.newProduct = this.initializeNewProduct(); // Reset the form
          Swal.fire('Success', 'Product added successfully', 'success');
        },
        (error) => {
          console.error('Error adding product:', error);
          Swal.fire('Error', 'Failed to add product', 'error');
        }
      );
    } else {
      // Form is invalid; provide user feedback
      Swal.fire('Error', 'Please complete the form before submitting', 'error');
      console.log('form: ', this.addProductForm.value);
      this.addProductForm.markAllAsTouched(); // Highlight all invalid fields
    }
  }

  /* 
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
        'bestSellers',
        this.addProductForm.get('bestSellers')?.value
      );
      formData.append('rank', this.addProductForm.get('rank')?.value);
      formData.append(
        'status.availability',
        this.addProductForm.get('status.availability')?.value
      );
      formData.append(
        'status.stockStatus',
        this.addProductForm.get('status.stockStatus')?.value
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
        (error) => {
          console.error('Error adding product:', error);
          Swal.fire('Error', 'Failed to add product', 'error');
        }
      );
    }
  } */

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
          Swal.fire('Error', 'Failed to add category', 'error');
        }
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
      // Swal.fire('Success', 'Image uploaded successfully', 'success');
    } else {
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
      (error) => {
        console.error('Error updating product:', error);
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
      (error) => {
        console.error('Error deleting product:', error);
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
      (error) => {
        console.error('Error updating user:', error);
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
      (error) => {
        console.error('Error deleting user:', error);
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
    );
  }

  updateCategory(category: Category): void {
    console.log('Category:', category);
    console.log('Category ID:', category._id);
    this.adminDashboardService.updateCategory(category._id, category).subscribe(
      (updatedCategory) => {
        console.log('Category updated:', updatedCategory);
        this.loadCategories();
        this.isEditingCategory = false; // Set editing to false
        this.updateCategory(updatedCategory);
        Swal.fire('Success', 'Category updated successfully', 'success');
      },
      (error) => {
        console.error('Error updating category:', error);
        Swal.fire('Error', 'Failed to update category', 'error');
      }
    );
  }

  deleteCategory(id: string): void {
    console.log('Category ID:', id);
    this.adminDashboardService.deleteCategory(id).subscribe(
      () => {
        console.log('Category deleted');
        this.loadCategories();
        Swal.fire('Success', 'Category deleted successfully', 'success');
      },
      (error) => {
        console.error('Error deleting category:', error);
        Swal.fire('Error', 'Failed to delete category', 'error');
      }
    );
  }

  editCategory(categoryId: string, category: Category): void {
    console.log('Category ID:', categoryId);
    this.adminDashboardService.editCategory(categoryId, category).subscribe(
      (updatedCategory) => {
        console.log('Category updated:', updatedCategory);
        this.loadCategories();
        Swal.fire('Success', 'Category updated successfully', 'success');
      },
      (error) => {
        console.error('Error updating category:', error);
        Swal.fire('Error', 'Failed to update category', 'error');
      }
    );
  }
}
