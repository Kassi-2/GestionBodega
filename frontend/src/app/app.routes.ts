import { Routes } from '@angular/router';
import { UserStudentListComponent } from './pages/users/user-student-list/user-student-list.component';
import { UserTeacherListComponent } from './pages/users/user-teacher-list/user-teacher-list.component';
import { UserAssistantListComponent } from './pages/users/user-assistant-list/user-assistant-list.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { LendingActiveListComponent } from './pages/lendings/lending-active-list/lending-active-list/lending-active-list.component';
import { LendingAddComponent } from './pages/lendings/lending-add/lending-add/lending-add.component';


export const routes: Routes = [
  { path: 'users/students', component: UserStudentListComponent },
  { path: 'users/teachers', component: UserTeacherListComponent },
  { path: 'users/assistants', component: UserAssistantListComponent },
  { path: 'inventory', component: ViewProductsComponent },
  { path: 'lending', component: LendingActiveListComponent },
  { path: 'lending/add', component: LendingAddComponent },

];
