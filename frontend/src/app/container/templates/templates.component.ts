import { Component, OnInit } from '@angular/core';
import { CrudHeaderComponent } from './crud-header/crud-header.component';
import { CrudTableComponent } from './crud-table/crud-table.component';
import { CrudPaginationComponent } from './crud-pagination/crud-pagination.component';
import { TemplateEntity } from './template-entity.model';
import { TemplateService } from './template.service';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    CrudHeaderComponent,
    CrudTableComponent,
    CrudPaginationComponent,
    CrudFormComponent,
    NgIf,
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.css',
})
export class TemplatesComponent implements OnInit {
  templatesList: TemplateEntity[] = [];
  pageNumber = 1;
  totalElements = 0;
  size = 25;
  totalPages = 0;
  sortColumns = 'id';
  sortDirections = 'asc';
  searchBy = '';

  showModal = false;
  modalMode: 'add' | 'edit' | 'view' | 'delete' = 'view';
  selectedTemplate: TemplateEntity | null = null;
  errorMessage: string[] | null = null;

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.fetchTemplates(
      this.pageNumber,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  fetchTemplates(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): void {
    this.templateService
      .getTemplates(page - 1, size, sortColumns, sortDirections, searchBy)
      .subscribe((response) => {
        this.templatesList = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      });
  }

  onPageChanged(page: number): void {
    this.pageNumber = page;
    this.fetchTemplates(
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
    this.fetchTemplates(
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
    this.fetchTemplates(
      this.pageNumber,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  openModal(
    mode: 'add' | 'edit' | 'view' | 'delete',
    template?: TemplateEntity
  ) {
    this.modalMode = mode;
    this.errorMessage = null; // Reset the error message when opening the modal
    if (mode === 'add') {
      this.selectedTemplate = null; // Clear selected template for add mode
      this.showModal = true;
    } else if (template && template.id) {
      this.templateService.getTemplate(template.id).subscribe(
        (templateData) => {
          this.selectedTemplate = templateData;
          this.showModal = true;
        },
        (error) => {
          console.error('Error fetching template', error);
          // Handle error appropriately
        }
      );
    }
  }

  closeModal() {
    this.showModal = false;
  }

  saveTemplate(template: TemplateEntity) {
    if (this.modalMode === 'add') {
      this.templateService.addTemplate(template).subscribe(
        (newTemplate) => {
          this.fetchTemplates(
            this.pageNumber,
            this.size,
            this.sortColumns,
            this.sortDirections,
            this.searchBy
          );
          this.closeModal();
        },
        (error) => {
          console.error('Error adding template', error);
          this.errorMessage = error;
          this.showModal = true; // Ensure the modal stays open
        }
      );
    } else if (this.modalMode === 'edit') {
      this.templateService.updateTemplate(template).subscribe(
        (updatedTemplate) => {
          const index = this.templatesList.findIndex(
            (e) => e.id === template.id
          );
          if (index !== -1) {
            this.templatesList[index] = updatedTemplate; // Update the existing template in the list
          }
          this.closeModal();
        },
        (error) => {
          console.error('Error updating template', error);
          this.errorMessage = error;
          this.showModal = true; // Ensure the modal stays open
        }
      );
    }
  }

  deleteTemplate(template: TemplateEntity) {
    this.templateService.deleteTemplate(template.id).subscribe(
      () => {
        this.fetchTemplates(
          this.pageNumber,
          this.size,
          this.sortColumns,
          this.sortDirections,
          this.searchBy
        );
        this.closeModal();
      },
      (error) => {
        console.error('Error deleting template', error);
        this.errorMessage = error;
        this.showModal = true;
      }
    );
  }
}
