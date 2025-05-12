import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
  Renderer2
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

export interface Task {
  name: string;
  status: 'Completed' | 'Pending' | 'Planned';
  date: string;
  description: string;
  descVisible: boolean;
}

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.scss']
})
export class TaskFormModalComponent implements AfterViewInit {
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('modalElement') modalElement!: ElementRef;

  taskForm: FormGroup;
  showModal = false;

  private previouslyFocusedElement: HTMLElement | null = null;
  private removeKeyListenerFn: (() => void) | null = null;

  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required, this.dateNotInPastValidator]],
      description: [''],
      status: ['Planned']
    });
  }

  ngAfterViewInit(): void {}

  openModal() {
    this.showModal = true;
    this.resetForm();
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    setTimeout(() => {
      this.trapFocus();
    }, 0);
  }

  close() {
    this.showModal = false;
    this.closeModal.emit();

    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }

    if (this.removeKeyListenerFn) {
      this.removeKeyListenerFn();
      this.removeKeyListenerFn = null;
    }
  }

  resetForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    this.taskForm.reset({
      name: '',
      date: formattedDate,
      description: '',
      status: 'Planned'
    });
  }

  submitForm() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        ...this.taskForm.value,
        descVisible: false
      };

      this.taskAdded.emit(newTask);
      this.close();
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  dateNotInPastValidator(control: any) {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(control.value);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { pastDate: true };
  }

  private trapFocus() {
    const modal = this.modalElement.nativeElement as HTMLElement;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (firstEl) {
      firstEl.focus();
    }

    this.removeKeyListenerFn = this.renderer.listen(modal, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }

      if (e.key === 'Escape') {
        this.close();
      }
    });
  }
}
