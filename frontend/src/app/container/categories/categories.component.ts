import { Component, OnInit } from '@angular/core';
import { CrudHeaderComponent } from './crud-header/crud-header.component';
import { CrudTableComponent } from './crud-table/crud-table.component';
import { CrudPaginationComponent } from './crud-pagination/crud-pagination.component';
import { CategoryEntity } from './category-entity.model';
import { CategoryService } from './category.service';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CrudHeaderComponent,
    CrudTableComponent,
    CrudPaginationComponent,
    CrudFormComponent,
    NgIf,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categoriesList: CategoryEntity[] = [];
  pageNumber = 1;
  totalElements = 0;
  size = 25;
  totalPages = 0;
  sortColumns = 'id';
  sortDirections = 'asc';
  searchBy = '';

  showModal = false;
  modalMode: 'add' | 'edit' | 'view' | 'delete' = 'view';
  selectedCategory: CategoryEntity | null = null;
  errorMessage: string[] | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories(
      this.pageNumber,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  fetchCategories(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): void {
    this.categoryService
      .getCategories(page - 1, size, sortColumns, sortDirections, searchBy)
      .subscribe((response) => {
        this.categoriesList = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      });
  }

  onPageChanged(page: number): void {
    this.pageNumber = page;
    this.fetchCategories(
      this.pageNumber,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  onSortChanged(sortColumns: string, sortDirections: string): void {
    this.sortColumns = sortColumns;
    this.sortDirections = sortDirections;
    this.fetchCategories(
      this.pageNumber,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  onSearchChanged(searchBy: string) {
    this.searchBy = searchBy;
    this.pageNumber = 1;
    this.fetchCategories(
      this.pageNumber,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  openModal(
    mode: 'add' | 'edit' | 'view' | 'delete',
    category?: CategoryEntity
  ) {
    this.modalMode = mode;
    this.errorMessage = null; // Reset the error message when opening the modal
    if (mode === 'add') {
      this.selectedCategory = null; // Clear selected category for add mode
      this.showModal = true;
    } else if (category && category.id) {
      this.categoryService.getCategory(category.id).subscribe(
        (categoryData) => {
          this.selectedCategory = categoryData;
          this.showModal = true;
        },
        (error) => {
          console.error('Error fetching category', error);
          // Handle error appropriately
        }
      );
    }
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory(category: CategoryEntity) {
    if (this.modalMode === 'add') {
      this.categoryService.addCategory(category).subscribe(
        (newCategory) => {
          this.fetchCategories(
            this.pageNumber,
            this.size,
            this.sortColumns,
            this.sortDirections,
            this.searchBy
          );
          this.closeModal();
        },
        (error) => {
          console.error('Error adding category', error);
          this.errorMessage = error;
          this.showModal = true; // Ensure the modal stays open
        }
      );
    } else if (this.modalMode === 'edit') {
      this.categoryService.updateCategory(category).subscribe(
        (updatedCategory) => {
          const index = this.categoriesList.findIndex(
            (e) => e.id === category.id
          );
          if (index !== -1) {
            this.categoriesList[index] = updatedCategory; // Update the existing category in the list
          }
          this.closeModal();
        },
        (error) => {
          console.error('Error updating category', error);
          this.errorMessage = error;
          this.showModal = true; // Ensure the modal stays open
        }
      );
    }
  }

  deleteCategory(category: CategoryEntity) {
    this.categoryService.deleteCategory(category.id).subscribe(
      () => {
        this.fetchCategories(
          this.pageNumber,
          this.size,
          this.sortColumns,
          this.sortDirections,
          this.searchBy
        );
        this.closeModal();
      },
      (error) => {
        console.error('Error deleting category', error);
        this.errorMessage = error;
        this.showModal = true;
      }
    );
  }
}
