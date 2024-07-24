import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-crud-pagination',
  standalone: true,
  imports: [],
  templateUrl: './crud-pagination.component.html',
  styleUrl: './crud-pagination.component.css'
})
export class CrudPaginationComponent {
  @Input() totalElements!: number;
  @Input() size!: number;
  @Output() pageChanged = new EventEmitter<number>();

  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.size);
  }

  firstPage(): void {
    this.changePage(1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  lastPage(): void {
    this.changePage(this.totalPages);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);
    }
  }

  onPageInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const page = target.valueAsNumber;
    if (!isNaN(page)) {
      this.changePage(page);
    }
  }
}
