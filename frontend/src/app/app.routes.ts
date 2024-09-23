import { Routes } from '@angular/router';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { UserStudentListComponent } from './pages/users/user-student-list/user-student-list.component';
import { UserTeacherListComponent } from './pages/users/user-teacher-list/user-teacher-list.component';
import { UserAssistantListComponent } from './pages/users/user-assistant-list/user-assistant-list.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';

export const routes: Routes = [
  { path: '', component: ViewProductsComponent },
  { path: 'inventory', component: ViewProductsComponent },
  { path: 'inventory/add-product', component: AddProductComponent },
  { path: 'users/students', component: UserStudentListComponent },
  { path: 'users/teachers', component: UserTeacherListComponent },
  { path: 'users/assistants', component: UserAssistantListComponent },
  { path: 'users/create', component: AddUserComponent },
];
