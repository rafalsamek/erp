import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { CategoryEntity } from '../category-entity.model';
import { provideIcons, NgIconsModule } from '@ng-icons/core';
import {
  heroEye,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'categories-crud-table',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, NgIconsModule],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.css',
  providers: [provideIcons({ heroEye, heroPencilSquare, heroTrash })],
})
export class CrudTableComponent {
  @Input() categoriesList: CategoryEntity[] = [];
  @Output() sortChanged = new EventEmitter<{
    sortColumns: string;
    sortDirections: string;
  }>();

  @Output() editCategory = new EventEmitter<CategoryEntity>();
  @Output() viewCategory = new EventEmitter<CategoryEntity>();
  @Output() deleteCategory = new EventEmitter<CategoryEntity>();

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

  view(category: CategoryEntity): void {
    this.viewCategory.emit(category);
  }

  edit(category: CategoryEntity): void {
    this.editCategory.emit(category);
  }

  delete(category: CategoryEntity): void {
    this.deleteCategory.emit(category);
  }
}
