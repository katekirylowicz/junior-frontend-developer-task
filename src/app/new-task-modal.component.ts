import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

export class TaskFormModalComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() closeModal = new EventEmitter<void>();

  taskForm: FormGroup;
  showModal = false;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required, this.dateNotInPastValidator]],
      description: [''],
      status: ['Planned']
    });
  }

  openModal() {
    this.showModal = true;
    this.resetForm();
  }

  close() {
    this.showModal = false;
    this.closeModal.emit();
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
}
