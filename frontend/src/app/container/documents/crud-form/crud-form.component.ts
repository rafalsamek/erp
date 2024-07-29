import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  HostListener,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DocumentEntity} from "../document-entity.model";

@Component({
  selector: 'documents-crud-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.css'
})

export class CrudFormComponent implements OnInit {
  @Input() showModal = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'view';
  @Input() document: DocumentEntity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<DocumentEntity>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    if (this.document) {
      this.form.setValue({
        title: this.document.title,
        description: this.document.description || '',
      });
    }
    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.close.emit();
  }

  onSubmit() {
      if (this.form.valid) {
        const formValue = this.form.value;
        const documentToSave = {
          ...formValue,
        };
        this.save.emit(documentToSave);
        this.closeModal();
      } else {
        this.form.markAllAsTouched();
      }
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
}

