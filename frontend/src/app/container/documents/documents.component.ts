import { Component } from '@angular/core';
import {CrudHeaderComponent} from "./crud-header/crud-header.component";
import {CrudTableComponent} from "./crud-table/crud-table.component";
import {PaginationComponent} from "./pagination/pagination.component";
import {DocumentEntity} from "./document-entity.model";

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
export class DocumentsComponent {
  ngOnInit(): void {
    this.fetchDocuments();
  }

  documentsList: DocumentEntity[] = [];

  fetchDocuments() {
    this.documentsList = [
      {
        id: 1,
        title: 'Document 1',
        description: 'Description for document 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Document 2',
        description: 'Description for document 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Document 3',
        description: 'Description for document 3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    return this.documentsList;
  }
}
