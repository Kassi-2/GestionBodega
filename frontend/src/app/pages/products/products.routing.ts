import { Routes, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';
import { AddProductComponent } from './add-product/add-product/add-product.component';

export const routesProduct: Routes = [
  {path: '', component: AddProductComponent}
]

export const ProductsRoutes = RouterModule.forChild(routes);
