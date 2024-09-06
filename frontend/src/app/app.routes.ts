import { ProductsRoutes } from './pages/products/products.routing';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./products/products.routing').then(m =>m.ProductsRoutes)
  },
];
