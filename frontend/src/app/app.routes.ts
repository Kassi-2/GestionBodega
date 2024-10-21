import { Routes } from '@angular/router';
import { UserStudentListComponent } from './pages/users/user-student-list/user-student-list.component';
import { UserTeacherListComponent } from './pages/users/user-teacher-list/user-teacher-list.component';
import { UserAssistantListComponent } from './pages/users/user-assistant-list/user-assistant-list.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';

export const routes: Routes = [
  { path: 'users/students', component: UserStudentListComponent },
  { path: 'users/teachers', component: UserTeacherListComponent },
  { path: 'users/assistants', component: UserAssistantListComponent },
  { path: 'inventory', component: ViewProductsComponent },
];
