import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'documents-crud-header',
  standalone: true,
  templateUrl: './crud-header.component.html',
  styleUrl: './crud-header.component.css',
  imports: [FormsModule],
})
export class CrudHeaderComponent {
  @Input() searchBy = '';
  @Output() searchChanged = new EventEmitter<string>();
  @Output() addDocument = new EventEmitter<void>();

  onSearchInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchBy = target.value;
    this.searchChanged.emit(this.searchBy);
  }

  onSearch() {
    console.log('searchBy:', this.searchBy);
    this.searchChanged.emit(this.searchBy);
  }

  openModal(mode: string) {
    this.addDocument.emit();
  }
}
