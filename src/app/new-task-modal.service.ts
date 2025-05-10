import { Injectable } from '@angular/core';
import { Task } from './new-task-modal.component';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'task-list';

  constructor() { }

  getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.STORAGE_KEY);
    if (tasksJson) {
      return JSON.parse(tasksJson);
    }
    return [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  addTask(task: Task): Task[] {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
    return tasks;
  }

  updateTask(updatedTask: Task, index: number): Task[] {
    const tasks = this.getTasks();
    if (index >= 0 && index < tasks.length) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
    }

    return tasks;
  }
}
