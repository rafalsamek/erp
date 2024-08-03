import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DocumentEntity } from '../document-entity.model';
import { provideIcons, NgIconsModule } from '@ng-icons/core';
import {
  heroEye,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'documents-crud-table',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, NgIconsModule],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.css',
  providers: [provideIcons({ heroEye, heroPencilSquare, heroTrash })],
})
export class CrudTableComponent {
  @Input() documentsList: DocumentEntity[] = [];
  @Output() sortChanged = new EventEmitter<{
    sortColumns: string;
    sortDirections: string;
  }>();

  @Output() editDocument = new EventEmitter<DocumentEntity>();
  @Output() viewDocument = new EventEmitter<DocumentEntity>();
  @Output() deleteDocument = new EventEmitter<DocumentEntity>();

  sortColumn = 'id';
  sortDirection = 'asc';

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortChanged.emit({
      sortColumns: this.sortColumn,
      sortDirections: this.sortDirection,
    });
  }

  view(document: DocumentEntity): void {
    this.viewDocument.emit(document);
  }

  edit(document: DocumentEntity): void {
    this.editDocument.emit(document);
  }

  delete(document: DocumentEntity): void {
    this.deleteDocument.emit(document);
  }
}
