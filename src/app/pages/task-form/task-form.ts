import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task';
import { TasksService } from '../../services/tasks';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css']
})
export class TaskForm implements OnInit {
  form!: FormGroup;

  loading = false;
  error = '';
  private editId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService
  ) {}

  get isEdit(): boolean {
    return this.editId !== null;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      notes: [''],     // <-- NUEVO
      done: [false]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.editId = idParam;
    this.loading = true;
    this.error = '';

    this.tasksService.getById(idParam).subscribe({
      next: (t: Task) => {
        this.form.patchValue({
          title: t.title ?? '',
          notes: t.notes ?? '',
          done: !!t.done
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la tarea para editar';
        this.loading = false;
      }
    });
  }

  submit(): void {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Omit<Task, 'id'> = {
      title: (this.form.value.title ?? '').toString().trim(),
      notes: (this.form.value.notes ?? '').toString().trim(),
      done: !!this.form.value.done
    };

    this.loading = true;

    const req$ = this.isEdit
      ? this.tasksService.update(this.editId as string, payload)
      : this.tasksService.create(payload);

    req$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading = false;
        this.error = this.isEdit
          ? 'No se pudo actualizar la tarea'
          : 'No se pudo crear la tarea';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
