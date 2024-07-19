import { Component } from '@angular/core';
import {CrudHeaderComponent} from "./crud-header/crud-header.component";
import {CrudTableComponent} from "./crud-table/crud-table.component";
import {PaginationComponent} from "./pagination/pagination.component";

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

}
