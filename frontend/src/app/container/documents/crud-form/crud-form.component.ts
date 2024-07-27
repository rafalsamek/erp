import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';

@Component({
  selector: 'documents-crud-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.css'
})

export class CrudFormComponent implements OnInit {
  @Input() showModal = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'view';
  @Input() document: any = {};
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();


  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.close.emit();
  }

  onSubmit() {
    this.save.emit(this.document);
    this.closeModal();
  }

  getTitle(): string {
    if (this.mode === 'add') {
      return 'Add Document';
    } else if (this.mode === 'edit') {
      return 'Edit Document';
    } else {
      return 'View Document';
    }
  }

  ngOnInit(): void {
  }
}

