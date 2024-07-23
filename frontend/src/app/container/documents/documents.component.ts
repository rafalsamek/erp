import { Component, OnInit } from '@angular/core';
import { CrudHeaderComponent } from "./crud-header/crud-header.component";
import { CrudTableComponent } from "./crud-table/crud-table.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { DocumentEntity } from "./document-entity.model";
import { DocumentService } from "./document.service";

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CrudHeaderComponent,
    CrudTableComponent,
    PaginationComponent
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  documentsList: DocumentEntity[] = [];
  currentPage = 1;
  totalElements = 0;
  size = 25;
  totalPages = 0;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.fetchDocuments(this.currentPage, this.size);
  }

  fetchDocuments(page: number, size: number): void {
    this.documentService.getDocuments(page - 1, size)
      .subscribe(response => {
        this.documentsList = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      });
  }

  onPageChanged(page: number): void {
    console.log('Current page:', page);
    this.currentPage = page;
    this.fetchDocuments(this.currentPage, this.size);
  }
}
