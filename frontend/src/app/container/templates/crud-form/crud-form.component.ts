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
import { TemplateEntity } from '../template-entity.model';

@Component({
  selector: 'templates-crud-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.css',
})
export class CrudFormComponent implements OnInit, OnChanges {
  @Input() showModal = false;
  @Input() mode: 'add' | 'edit' | 'view' | 'delete' = 'view';
  @Input() template: TemplateEntity | null = null;
  @Input() errorMessage: string[] | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TemplateEntity>();
  @Output() delete = new EventEmitter<TemplateEntity>();

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
    if (changes['template'] && !changes['template'].currentValue) {
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
    if (this.template) {
      this.form.setValue({
        id: this.template.id,
        title: this.template.title,
        description: this.template.description || '',
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
    if (this.mode === 'delete' && this.template) {
      this.deleteTemplate(this.template);
      return;
    }

    if (this.form.valid) {
      const formValue = this.form.value;
      const templateToSave: TemplateEntity = {
        ...formValue,
        file: formValue.file,
      };
      this.save.emit(templateToSave);
    } else {
      this.form.markAllAsTouched();
    }
  }

  deleteTemplate(template: TemplateEntity) {
    this.delete.emit(template);
    this.closeModal();
  }

  getTitle(): string {
    if (this.mode === 'add') {
      return 'Add Template';
    } else if (this.mode === 'edit') {
      return 'Edit Template';
    } else if (this.mode === 'delete') {
      return 'Delete Template';
    } else {
      return 'View Template';
    }
  }
}
