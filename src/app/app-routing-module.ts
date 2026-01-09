import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { TasksList } from './pages/tasks-list/tasks-list';
import { TaskDetail } from './pages/task-detail/task-detail';
import { TaskForm } from './pages/task-form/task-form';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },

  { path: 'tasks', component: TasksList },
  { path: 'tasks/new', component: TaskForm },
  { path: 'tasks/:id', component: TaskDetail },
  { path: 'tasks/:id/edit', component: TaskForm },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
