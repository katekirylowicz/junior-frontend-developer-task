import { Component, OnInit, ViewChild  } from '@angular/core';
import { NgClass, NgStyle, CommonModule } from '@angular/common';
import { TaskFormModalComponent, Task } from './new-task-modal.component';
import { TaskService } from './new-task-modal.service';
import { TaskFilterComponent, TaskFilters } from './filters.component';

@Component({
  selector: 'app-root',
  imports: [NgClass, CommonModule, TaskFormModalComponent, TaskFilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})

export class AppComponent implements OnInit {
  title = 'junior-frontend-developer-task';
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  private currentFilters: TaskFilters = {
    name: '',
    date: '',
    status: 'All'
  };
  
  @ViewChild(TaskFormModalComponent) taskFormModal!: TaskFormModalComponent;
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit() {
    const storedTasks = this.taskService.getTasks();
    
    if (storedTasks.length > 0) {
      this.tasks = storedTasks;
    } else {
      this.tasks = [
        {
          name: 'Zrobić zakupy spożywcze', 
          status: 'Completed' as 'Completed', 
          date: '2025-05-01', 
          description: 'Muszę kupić mleko, mąkę i jajka.', 
          descVisible: false 
        },
        {
          name: 'Opłacić rachunki',
          status: 'Pending' as 'Pending',
          date: '2025-05-10',
          description: 'Tylko nie odkładaj tego na inny dzień!',
          descVisible: false
        },
        {
          name: 'Urodziny mamy',
          status: 'Planned' as 'Planned',
          date: '2025-05-15',
          description: 'Kupić kwiaty i tort.',
          descVisible: false
        }
      ];
      this.taskService.saveTasks(this.tasks);
    }

    this.filteredTasks = [...this.tasks];
  }

  toggleCompleted(task: Task) {
    task.status = task.status === 'Completed' ? 'Planned' : 'Completed';
    this.taskService.saveTasks(this.tasks);
    this.applyFilters(this.currentFilters);
  }

  toggleDescription(index: number): void {
    const taskIndex = this.tasks.indexOf(this.filteredTasks[index]);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].descVisible = !this.tasks[taskIndex].descVisible;
      this.filteredTasks[index].descVisible = this.tasks[taskIndex].descVisible;
    }
  }

  openAddTaskModal() {
    this.taskFormModal.openModal();
  }

  onTaskAdded(newTask: Task) {
    this.tasks = this.taskService.addTask(newTask);
    this.applyFilters(this.currentFilters);
  }

  onFiltersChanged(filters: TaskFilters): void {
    this.currentFilters = filters;
    this.applyFilters(filters);
  }

  private applyFilters(filters: TaskFilters): void {
    this.filteredTasks = this.tasks.filter(task => {

      const nameMatches = filters.name ?
        task.name.toLowerCase().includes(filters.name.toLowerCase()) :
        true;
      
      const dateMatches = filters.date ?
        task.date === filters.date :
        true;
      
      const statusMatches = filters.status === 'All' ?
        true : 
        task.status === filters.status;
      
      return nameMatches && dateMatches && statusMatches;
    });
  }
}
