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
import { CategoryEntity } from '../category-entity.model';

@Component({
  selector: 'categories-crud-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.css',
})
export class CrudFormComponent implements OnInit, OnChanges {
  @Input() showModal = false;
  @Input() mode: 'add' | 'edit' | 'view' | 'delete' = 'view';
  @Input() category: CategoryEntity | null = null;
  @Input() errorMessage: string[] | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CategoryEntity>();
  @Output() delete = new EventEmitter<CategoryEntity>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && !changes['category'].firstChange) {
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
    if (this.category) {
      this.form.setValue({
        id: this.category.id,
        name: this.category.name,
        description: this.category.description || '',
      });
    } else {
      this.form.reset({
        id: 0,
        name: '',
        description: '',
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

  onSubmit() {
    if (this.mode === 'delete' && this.category) {
      this.deleteCategory(this.category);
      return;
    }

    if (this.form.valid) {
      const formValue = this.form.value;
      const categoryToSave = {
        ...formValue,
      };
      this.save.emit(categoryToSave);
    } else {
      this.form.markAllAsTouched();
    }
  }

  deleteCategory(category: CategoryEntity) {
    this.delete.emit(category);
    this.closeModal();
  }

  getName(): string {
    if (this.mode === 'add') {
      return 'Add Category';
    } else if (this.mode === 'edit') {
      return 'Edit Category';
    } else if (this.mode === 'delete') {
      return 'Delete Category';
    } else {
      return 'View Category';
    }
  }
}
