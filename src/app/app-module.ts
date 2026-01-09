import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { Home } from './pages/home/home';
import { TasksList } from './pages/tasks-list/tasks-list';
import { TaskDetail } from './pages/task-detail/task-detail';
import { TaskForm } from './pages/task-form/task-form';

@NgModule({
  declarations: [
    App,
    Navbar,
    Home,
    TasksList,
    TaskDetail,
    TaskForm
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
  provideBrowserGlobalErrorListeners(),
  provideHttpClient(withInterceptorsFromDi())
  ],

  bootstrap: [App]
})
export class AppModule { }
