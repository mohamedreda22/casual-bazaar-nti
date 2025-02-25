import { Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/categoryInterface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: '../dashboard.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isAddingCategory: boolean = false;
  isEditingCategory: boolean = false;
  newCategory: Category = this.initializeNewCategory();

  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
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
      // console.log('Form data:', this.editCategoryForm.value); // Debugging
      const updatedCategory = {
        ...this.newCategory, // Use the existing category details
        ...this.editCategoryForm.value, // Merge with form changes
      };
      const categoryId = this.currentCategory
        ? this.currentCategory._id
        : updatedCategory._id;
      // console.log('updatedCategory ID :', categoryId);

      this.adminDashboardService
        .updateCategory(categoryId, updatedCategory)
        .subscribe({
          next: (response) => {
            // console.log('Category updated successfully:', response);
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
    this.loadCategories();
  }

  /*   showSection(section: string): void {
    this.currentSection = section;
  } */

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
      // console.log('Form data:', this.addCategoryForm.value); // Debugging
      const formData = {
        name: this.addCategoryForm.get('name')?.value,
        subCategories: this.addCategoryForm.get('subCategories')?.value,
        show: this.addCategoryForm.get('show')?.value,
      };

      this.adminDashboardService.addCategory(formData).subscribe(
        (newCategory) => {
          // console.log('Category added:', newCategory);
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

  updateCategory(category: Category): void {
    this.adminDashboardService.updateCategory(category._id, category).subscribe(
      (updatedCategory) => {
        // console.log('Category updated:', updatedCategory);
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

toggleCategoryStatus(category: Category): void {
  const updatedStatus = category.show ? false : true;
  const updatedCategory = { ...category, show: updatedStatus };

  this.adminDashboardService.updateCategory(category._id, updatedCategory).subscribe(
    () => {
      this.loadCategories();
      Swal.fire('Success', `Category ${updatedStatus ? 'shown' : 'hidden'} successfully`, 'success');
    },
    (error) => {
      console.error('Error updating category status:', error);
      Swal.fire('Error', `Failed to update category status`, 'error');
    }
  );
}

  deleteCategory(id: string): void {
    // console.log('Category ID:', id);
    this.adminDashboardService.deleteCategory(id).subscribe(
      () => {
        // console.log('Category deleted');
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
    // console.log('Category ID:', categoryId);
    this.adminDashboardService.editCategory(categoryId, category).subscribe(
      (updatedCategory) => {
        // console.log('Category updated:', updatedCategory);
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
