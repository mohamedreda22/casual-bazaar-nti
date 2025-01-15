import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Category } from '../interfaces/categoryInterface';
import { AdminDashboardService } from '../services/admin-dashboard.service';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  filterForm: FormGroup;
  categories: Category[] = [];
  subCategories: Category['subCategories'] = [];

  @Output() applyFilters: EventEmitter<any> = new EventEmitter();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private adminDashboardService: AdminDashboardService
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      category: [''],
      subCategory: [''],
      priceRange: [''],
      availability: [''],
      stockStatus: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.adminDashboardService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
        if (categories.length > 0) {
          this.onCategoryChange();
        }
      },
      (error) => console.error('Error loading categories:', error)
    );
  }

  onCategoryChange(): void {
    const selectedCategoryName = this.filterForm.get('category')?.value;
    const selectedCategory = this.categories.find(
      (category) => category.name === selectedCategoryName
    );

    if (selectedCategory) {
      this.subCategories = selectedCategory.subCategories; 
      this.filterForm.get('subCategory')?.setValue(''); 
      this.filterForm.get('subCategory')?.enable(); 
    } else {
      this.subCategories = [];
      this.filterForm.get('subCategory')?.disable(); 
      this.filterForm.get('subCategory')?.setValue(''); 
    }
  }

  onApplyFilter(): void {
    this.applyFilters.emit(this.filterForm.value);
  }

  onResetFilter(): void {
    this.filterForm.reset();
    this.resetFilters.emit();
  }
}
