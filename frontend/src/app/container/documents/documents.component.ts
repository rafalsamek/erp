import { Component } from '@angular/core';
import {CrudHeaderComponent} from "./crud-header/crud-header.component";

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CrudHeaderComponent
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {

}
