import { Component, Input } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {DocumentEntity} from "../document-entity.model";

@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.css'
})
export class CrudTableComponent {
  @Input() documentsList: DocumentEntity[] = [];
}
