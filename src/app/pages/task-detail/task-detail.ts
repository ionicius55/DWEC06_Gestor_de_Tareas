import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task';
import { TasksService } from '../../services/tasks';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.css']
})
export class TaskDetail implements OnInit {
  task: Task | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no válido';
      return;
    }

    this.loading = true;
    this.error = '';

    this.tasksService.getById(id).subscribe({
      next: (t) => {
        this.task = t;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el detalle';
        this.loading = false;
      }
    });
  }

  goEdit(): void {
    if (!this.task?.id) return;
    this.router.navigate(['/tasks', this.task.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  delete(): void {
    if (!this.task?.id) return;

    const ok = confirm(`¿Borrar la tarea "${this.task.title}"?`);
    if (!ok) return;

    this.loading = true;

    this.tasksService.remove(this.task.id).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo borrar la tarea';
      }
    });
  }
}

/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  task?: Task;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'ID no válido';
      return;
    }

    this.loading = true;
    this.error = '';

    this.tasksService.getById(id).subscribe({
      next: (t) => {
        this.task = t;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el detalle';
        this.loading = false;
      },
    });
  }

  goEdit(): void {
    if (!this.task?.id) return;
    this.router.navigate(['/tasks', this.task.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  delete(): void {
    if (!this.task?.id) return;

    this.error = '';
    this.loading = true;

    this.tasksService.remove(this.task.id).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo borrar la tarea';
      },
    });
  }
}
*/
