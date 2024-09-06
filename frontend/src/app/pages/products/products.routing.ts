import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product/add-product.component';

const routes: Routes = [
  {
    path: 'addProduct', component: AddProductComponent
   },
];

export const ProductsRoutes = RouterModule.forChild(routes);
