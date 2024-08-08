import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TemplateEntity } from '../template-entity.model';
import { provideIcons, NgIconsModule } from '@ng-icons/core';
import {
  heroEye,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'templates-crud-table',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, NgIconsModule],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.css',
  providers: [provideIcons({ heroEye, heroPencilSquare, heroTrash })],
})
export class CrudTableComponent {
  @Input() templatesList: TemplateEntity[] = [];
  @Output() sortChanged = new EventEmitter<{
    sortColumns: string;
    sortDirections: string;
  }>();

  @Output() editTemplate = new EventEmitter<TemplateEntity>();
  @Output() viewTemplate = new EventEmitter<TemplateEntity>();
  @Output() deleteTemplate = new EventEmitter<TemplateEntity>();

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

  view(template: TemplateEntity): void {
    this.viewTemplate.emit(template);
  }

  edit(template: TemplateEntity): void {
    this.editTemplate.emit(template);
  }

  delete(template: TemplateEntity): void {
    this.deleteTemplate.emit(template);
  }
}
