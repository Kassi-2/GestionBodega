import { Routes } from '@angular/router';
import { UserStudentListComponent } from './pages/users/user-student-list/user-student-list.component';
import { UserTeacherListComponent } from './pages/users/user-teacher-list/user-teacher-list.component';
import { UserAssistantListComponent } from './pages/users/user-assistant-list/user-assistant-list.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { LendingActiveComponent } from './pages/lending/lending-active/lending-active/lending-active.component';
import { LendingFinishComponent } from './pages/lending/lending-finish/lending-finish/lending-finish.component';
import { LendingInactiveComponent } from './pages/trash/lending-inactive/lending-inactive.component';
import { LendingAddComponent } from './pages/lending/lending-add/lending-add.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './pages/layouts/main-layout/main-layout.component';
import { LendingPendingComponent } from './pages/lending/lending-pending/lending-pending.component';
import { HistoryProductsComponent } from './pages/products/history-products/history-products.component';
import { ProductInactiveComponent } from './pages/trash/product-inactive/product-inactive.component';
import { UserInactiveComponent } from './pages/trash/user-inactive/user-inactive.component';
import { LendingAddQrComponent } from './pages/lending/lending-add-qr/lending-add-qr.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { InvoiceOptionsComponent } from './pages/invoices/invoice-options/invoice-options.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lendings/active',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'users/students',
        component: UserStudentListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'users/teachers',
        component: UserTeacherListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'users/assistants',
        component: UserAssistantListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'inventory',
        component: ViewProductsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'lendings/active',
        component: LendingActiveComponent,
        canActivate: [authGuard],
      },
      {
        path: 'lendings/pending',
        component: LendingPendingComponent,
        canActivate: [authGuard],
      },
      {
        path: 'lendings/finish',
        component: LendingFinishComponent,
        canActivate: [authGuard],
      },
      {
        path: 'lendings/inactive',
        component: LendingInactiveComponent,
        canActivate: [authGuard],
      },
      {
        path: 'lending-add',
        component: LendingAddComponent,
        canActivate: [authGuard],
      },
      {
        path: 'history-products/:id',
        component: HistoryProductsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'product-inactive',
        component: ProductInactiveComponent,
        canActivate: [authGuard],
      },
      {
        path: 'user-inactive',
        component: UserInactiveComponent,
        canActivate: [authGuard],
      },
      {
        path: 'lending-add/qr',
        component: LendingAddQrComponent,
        canActivate: [authGuard],
      },
      {
        path: 'category',
        component: CategoryListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'invoice',
        component: InvoiceOptionsComponent,
        canActivate: [authGuard],
      },
    ],
    canActivate: [authGuard],
  },

  { path: 'auth/login', component: LoginComponent, canActivate: [loginGuard] },
  { path: '**', redirectTo: 'lendings/active' },
];
