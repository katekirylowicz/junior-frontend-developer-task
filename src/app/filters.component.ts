import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TaskFilters {
  name: string;
  date: string;
  status: 'All' | 'Completed' | 'Pending' | 'Planned';
}

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})

export class TaskFilterComponent {
  filterName: string = '';
  filterDate: string = '';
  filterStatus: 'All' | 'Completed' | 'Pending' | 'Planned' = 'All';

  @Output() filtersChanged = new EventEmitter<TaskFilters>();

  applyFilters(): void {
    this.filtersChanged.emit({
      name: this.filterName,
      date: this.filterDate,
      status: this.filterStatus
    });
  }

  resetFilters(): void {
    this.filterName = '';
    this.filterDate = '';
    this.filterStatus = 'All';
    this.applyFilters();
  }
}
