import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'categories-crud-header',
  standalone: true,
  templateUrl: './crud-header.component.html',
  styleUrl: './crud-header.component.css',
  imports: [FormsModule, NgIconsModule],
  providers: [provideIcons({ heroPlus })],
})
export class CrudHeaderComponent {
  @Input() searchBy = '';
  @Output() searchChanged = new EventEmitter<string>();
  @Output() addCategory = new EventEmitter<void>();

  onSearchInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchBy = target.value;
    this.searchChanged.emit(this.searchBy);
  }

  add() {
    this.addCategory.emit();
  }
}
