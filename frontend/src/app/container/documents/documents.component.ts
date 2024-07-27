import { Component, OnInit } from '@angular/core';
import { CrudHeaderComponent } from './crud-header/crud-header.component';
import { CrudTableComponent } from './crud-table/crud-table.component';
import { CrudPaginationComponent } from './crud-pagination/crud-pagination.component';
import { DocumentEntity } from './document-entity.model';
import { DocumentService } from './document.service';
import {CrudFormComponent} from "./crud-form/crud-form.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CrudHeaderComponent, CrudTableComponent, CrudPaginationComponent, CrudFormComponent, NgIf],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent implements OnInit {
  documentsList: DocumentEntity[] = [];
  currentPage = 1;
  totalElements = 0;
  size = 25;
  totalPages = 0;
  sortColumns = 'id';
  sortDirections = 'asc';
  searchBy = '';

  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'view';
  selectedDocument: any = {};

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.fetchDocuments(
      this.currentPage,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  fetchDocuments(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): void {
    this.documentService
      .getDocuments(page - 1, size, sortColumns, sortDirections, searchBy)
      .subscribe((response) => {
        this.documentsList = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      });
  }

  onPageChanged(page: number): void {
    console.log('Current page:', page);
    this.currentPage = page;
    this.fetchDocuments(
      this.currentPage,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  onSortChanged(sortColumns: string, sortDirections: string): void {
    console.log('Current sortColumns:', sortColumns);
    console.log('Current sortDirections:', sortDirections);
    this.sortColumns = sortColumns;
    this.sortDirections = sortDirections;
    this.fetchDocuments(
      this.currentPage,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }

  onSearchChanged(searchBy: string) {
    this.searchBy = searchBy;
    this.currentPage = 1;
    this.fetchDocuments(
      this.currentPage,
      this.size,
      this.sortColumns,
      this.sortDirections,
      this.searchBy
    );
  }


  openModal(mode: 'add' | 'edit' | 'view', document?: DocumentEntity) {
    this.modalMode = mode;
    if (mode === 'add') {
      this.showModal = true;
    } else if (document && document.id) {
      this.documentService.getDocument(document.id).subscribe(
        (documentData) => {
          this.selectedDocument = documentData;
          this.showModal = true;
        },
        (error) => {
          console.error('Error fetching document', error);
          // Handle error appropriately
        }
      );
    }
  }

  closeModal() {
    this.showModal = false;
  }

  saveDocument(document: DocumentEntity) {
    if (this.modalMode === 'add') {
      this.documentService.addDocument(document).subscribe(
        (newDocument) => {
          this.documentsList.push(newDocument); // Add the new document to the list
          this.closeModal();
        },
        (error) => {
          console.error('Error adding document', error);
          // Handle error appropriately
        }
      );
    } else if (this.modalMode === 'edit') {
      this.documentService.updateDocument(document).subscribe(
        (updatedDocument) => {
          const index = this.documentsList.findIndex((e) => e.id === document.id);
          if (index !== -1) {
            this.documentsList[index] = updatedDocument; // Update the existing document in the list
          }
          this.closeModal();
        },
        (error) => {
          console.error('Error updating document', error);
          // Handle error appropriately
        }
      );
    }
  }
}
