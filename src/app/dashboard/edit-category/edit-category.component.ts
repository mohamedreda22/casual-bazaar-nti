import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-edit-category',
  standalone: false,
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent implements OnInit {
  
  editCategoryForm!: FormGroup;
  categoryId!: string;
  isEditingCategory: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadCategory();
  }

  // Initialize form with subcategories as a FormArray
  initializeForm(): void {
    this.editCategoryForm = this.fb.group({
      name: ['', Validators.required],
      subCategories: this.fb.array([], Validators.required),
      show: ['', Validators.required],
    });
  }

  // Helper to get subcategories FormArray
  get subCategories(): FormArray {
    return this.editCategoryForm.get('subCategories') as FormArray;
  }

  // Load category data into the form
  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.editCategoryForm.patchValue({
          name: category.name,
          show: category.show.toString(), // Convert to string for the dropdown
        });
        // Populate subcategories
        category.subCategories.forEach((sub: string) =>
          this.subCategories.push(this.fb.control(sub))
        );
      },
      error: (err) => console.error('Error fetching category:', err),
    });
  }

  // Add a new subcategory
  addSubCategory(subCategory: string): void {
    if (subCategory) {
      this.subCategories.push(this.fb.control(subCategory));
    }
  }

  // Remove a subcategory by index
  removeSubCategory(index: number): void {
    this.subCategories.removeAt(index);
  }

  // Handle form submission for updating the category
  handleUpdateCategory(): void {
    if (this.editCategoryForm.valid) {
      const updatedCategory = this.editCategoryForm.value;
      updatedCategory.show = updatedCategory.show === 'true'; // Convert to boolean
      this.categoryService
        .updateCategory(this.categoryId, updatedCategory)
        .subscribe({
          next: () => {
            alert('Category updated successfully!');
            this.router.navigate(['/categories']); // Navigate back to categories list
          },
          error: (err) => console.error('Error updating category:', err),
        });
    }
  }

  // Cancel edit and navigate back
  cancelEditCategory(): void {
    this.router.navigate(['/categories']);
  }
}
