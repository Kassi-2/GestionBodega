import { Routes } from '@angular/router';
import { UserStudentListComponent } from './pages/users/user-student-list/user-student-list.component';
import { UserTeacherListComponent } from './pages/users/user-teacher-list/user-teacher-list.component';
import { UserAssistantListComponent } from './pages/users/user-assistant-list/user-assistant-list.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [loginGuard], },
  { path: 'users/students', component: UserStudentListComponent, canActivate: [authGuard], },
  { path: 'users/teachers', component: UserTeacherListComponent, canActivate: [authGuard], },
  { path: 'users/assistants', component: UserAssistantListComponent, canActivate: [authGuard], },
  { path: 'inventory', component: ViewProductsComponent, canActivate: [authGuard], },
  { path: '**', redirectTo: 'users/students' },
];
