import { Routes } from '@angular/router';
import { UserStudentListComponent } from './pages/users/user-student-list/user-student-list.component';
import { UserTeacherListComponent } from './pages/users/user-teacher-list/user-teacher-list.component';
import { UserAssistantListComponent } from './pages/users/user-assistant-list/user-assistant-list.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { LendingActiveComponent } from './pages/lending/lending-active/lending-active/lending-active.component';
import { LendingFinishComponent } from './pages/lending/lending-finish/lending-finish/lending-finish.component';
import { LendingInactiveComponent } from './pages/lending/lending-inactive/lending-inactive.component';
import { LendingAddComponent } from './pages/lending/lending-add/lending-add.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [loginGuard], },
  { path: 'users/students', component: UserStudentListComponent, canActivate: [authGuard], },
  { path: 'users/teachers', component: UserTeacherListComponent, canActivate: [authGuard], },
  { path: 'users/assistants', component: UserAssistantListComponent, canActivate: [authGuard], },
  { path: 'inventory', component: ViewProductsComponent, canActivate: [authGuard], },
  { path: 'lendings/active', component: LendingActiveComponent},
  { path: 'lendings/finish', component: LendingFinishComponent},
  { path: 'lendings/inactive', component:LendingInactiveComponent},
  { path: 'lending-add', component: LendingAddComponent },
  { path: '**', redirectTo: 'users/students' },

];
