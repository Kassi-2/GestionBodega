import { Routes } from '@angular/router';
import { UserStudentListComponent } from './pages/users/user-student-list/user-student-list.component';
import { UserTeacherListComponent } from './pages/users/user-teacher-list/user-teacher-list.component';
import { UserAssistantListComponent } from './pages/users/user-assistant-list/user-assistant-list.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { LendingActiveComponent } from './pages/products/lendings/lending-active/lending-active/lending-active.component';
import { LendingFinishComponent } from './pages/products/lendings/lending-finish/lending-finish/lending-finish.component';

export const routes: Routes = [
  { path: 'users/students', component: UserStudentListComponent },
  { path: 'users/teachers', component: UserTeacherListComponent },
  { path: 'users/assistants', component: UserAssistantListComponent },
  { path: 'inventory', component: ViewProductsComponent },
  { path: 'lendings/active', component: LendingActiveComponent},
  { path: 'lendings/finish', component: LendingFinishComponent},
];
