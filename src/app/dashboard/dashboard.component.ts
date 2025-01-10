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
  users: User[] = [];
  categories: Category[] = [];
  filteredSubCategories: string[] = [];

  isAddingCategory: boolean = false;
  isEditingCategory: boolean = false;
  newCategory: Category = this.initializeNewCategory();

  errorMessage: string | null = null;

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
    this.loadUsers();
    this.loadCategories();
  }

  showSection(section: string): void {
    this.currentSection = section;
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



  showAddCategoryForm(): void {
    this.isAddingCategory = true;
  }



  toggleAddCategoryForm(): void {
    this.isAddingCategory = !this.isAddingCategory;
  }


  cancelAddCategory(): void {
    this.isAddingCategory = false;
    this.newCategory = this.initializeNewCategory();
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
