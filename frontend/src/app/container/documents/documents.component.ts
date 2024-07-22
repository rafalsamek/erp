import { Component } from '@angular/core';
import {CrudHeaderComponent} from "./crud-header/crud-header.component";
import {CrudTableComponent} from "./crud-table/crud-table.component";
import {PaginationComponent} from "./pagination/pagination.component";
import {DocumentEntity} from "./document-entity.model";
import {environment} from "../../../environments/environment";
import {DocumentService} from "./document.service";

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
  documentsList: DocumentEntity[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments() {
    console.log(`${environment.apiUrl}`);
    this.documentService
      .getDocuments()
      .subscribe((documents) => (this.documentsList = documents));
  }
}
