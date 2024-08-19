import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentEntity } from '../document-entity.model';

@Component({
  selector: 'documents-crud-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.css',
})
export class CrudFormComponent implements OnInit, OnChanges {
  @Input() showModal = false;
  @Input() mode: 'add' | 'edit' | 'view' | 'delete' = 'view';
  @Input() document: DocumentEntity | null = null;
  @Input() errorMessage: string[] | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<DocumentEntity>();
  @Output() delete = new EventEmitter<DocumentEntity>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [0, Validators.required],
      title: ['', Validators.required],
      description: [''],
      file: [null],
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['document'] && changes['document'].currentValue) {
      this.initializeForm();
    }
    if (changes['errorMessage'] && changes['errorMessage'].currentValue) {
      console.log(
        'Received Error Message:',
        changes['errorMessage'].currentValue
      );
    }
  }

  initializeForm() {
    if (this.document) {
      this.form.setValue({
        id: this.document.id,
        title: this.document.title,
        description: this.document.description || '',
        file: null,
      });
    } else {
      this.form.reset({
        id: 0,
        title: '',
        description: '',
        file: null,
      });
    }

    if (this.mode === 'view' || this.mode === 'delete') {
      this.form.disable();
    } else {
      this.form.enable();
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files?.[0];
      this.form.patchValue({ file: file });
      this.form.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.mode === 'delete' && this.document) {
      this.deleteDocument(this.document);
      return;
    }

    if (this.form.valid) {
      const formValue = this.form.value;
      const documentToSave: DocumentEntity = {
        ...formValue,
        file: formValue.file,
      };
      this.save.emit(documentToSave);
    } else {
      this.form.markAllAsTouched();
    }
  }

  deleteDocument(document: DocumentEntity) {
    this.delete.emit(document);
    this.closeModal();
  }

  getTitle(): string {
    if (this.mode === 'add') {
      return 'Add Document';
    } else if (this.mode === 'edit') {
      return 'Edit Document';
    } else if (this.mode === 'delete') {
      return 'Delete Document';
    } else {
      return 'View Document';
    }
  }
}
