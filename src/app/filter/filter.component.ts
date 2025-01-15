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

  @Output() applyFilters: EventEmitter<any> = new EventEmitter();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter();

  constructor(private fb: FormBuilder,private adminDashboardService: AdminDashboardService) {
    this.filterForm = this.fb.group({
      name: [''],
      category: [''],
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
      },
      (error) => console.error('Error loading categories:', error)
    );
  }
  onApplyFilter(): void {
    this.applyFilters.emit(this.filterForm.value);
  }

  onResetFilter(): void {
    this.filterForm.reset();
    this.resetFilters.emit();
  }
}
