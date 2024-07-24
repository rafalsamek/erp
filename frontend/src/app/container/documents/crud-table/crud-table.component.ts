import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DocumentEntity} from "../document-entity.model";

@Component({
  selector: 'documents-crud-table',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.css'
})
export class CrudTableComponent {
  @Input() documentsList: DocumentEntity[] = [];
  @Output() sortChanged = new EventEmitter<{sortColumns: string, sortDirections: string}>();

  sortColumn = 'id';
  sortDirection = 'asc';

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortChanged.emit({sortColumns: this.sortColumn, sortDirections: this.sortDirection});
  }
}
