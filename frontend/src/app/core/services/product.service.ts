import { Product } from './../models/product';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public products = new Array<Product>

  constructor() { }

  getProducts(): Observable<Product[]> {
    const products: Product[] = [
      new Product(1, 'Martillo', 'Martillos de alta calidad', 10, 1, 'active', 'available'),
      new Product(2, 'Alicate', 'Alicate multifuncional', 6, 1, 'active', 'available'),
      new Product(3, 'Tornillos', 'Tornillos variados', 40, 1, 'active', 'available'),
      new Product(4, 'Confort', 'Confort para mascotas', 10, 1, 'active', 'available'),
      new Product(5, 'Cloro', 'Cloro de limpieza', 10, 1, 'active', 'available')
    ];
    return of(products);
  }

}
