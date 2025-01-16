import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0; // Total items to paginate
  @Input() itemsPerPage: number = 9; // Number of items per page
  @Input() currentPage: number = 1; // Current active page
  @Output() pageChange = new EventEmitter<number>(); // Emit when page changes

  totalPages: number = 0; // Total number of pages
  pages: number[] = []; // Array of pages

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }
}
