import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Task } from '../../models/task';
import { TasksService } from '../../services/tasks';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-list',
  standalone: false,
  templateUrl: './tasks-list.html',
  styleUrls: ['./tasks-list.css']
})
export class TasksList implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  deleting = new Set<string>();

  constructor(
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.tasksService.getAll().subscribe({
      next: (data) => {
        this.tasks = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error cargando tareas';
        this.loading = false;
      }
    });
  }

  deleteTask(t: Task): void {
    this.error = '';

    if (!t.id) {
      this.error = 'ID no válido';
      return;
    }

    if (this.deleting.has(t.id)) return;

    const ok = confirm(`¿Borrar la tarea "${t.title}"?`);
    if (!ok) return;

    this.deleting.add(t.id);

    this.tasksService.remove(t.id).pipe(
      finalize(() => this.deleting.delete(t.id))
    ).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(x => x.id !== t.id);
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se ha podido borrar la tarea';
      }
    });
  }

  notesPreview(t: Task): string {
    const n = (t.notes ?? '').trim();
    if (!n) return '—';
    return n.length > 80 ? n.slice(0, 80) + '…' : n;
  }
}

/*
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Task } from '../../models/task';
import { TasksService } from '../../services/tasks';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-tasks-list',
  standalone: false,
  templateUrl: './tasks-list.html',
  styleUrls: ['./tasks-list.css']
})
export class TasksList implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  deleting = new Set<string>();

  constructor(
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.tasksService.getAll().subscribe({
      next: (data) => {
        this.tasks = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error cargando tareas';
        this.loading = false;
      }
    });
  }

  deleteTask(t: Task): void {
  this.error = '';

  if (!t.id) {
    this.error = 'ID no válido';
    return;
  }

  if (this.deleting.has(t.id)) return;

  const ok = confirm(`¿Borrar la tarea "${t.title}"?`);
  if (!ok) return;

  this.deleting.add(t.id);

  this.tasksService.remove(t.id).pipe(
    finalize(() => this.deleting.delete(t.id))
  ).subscribe({
    next: () => {
      this.tasks = this.tasks.filter(x => x.id !== t.id);
    },
    error: (e) => {
      console.error(e);
      this.error = 'No se ha podido borrar la tarea';
    }
  });
}

}
*/