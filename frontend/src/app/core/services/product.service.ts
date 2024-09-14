import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '../models/products.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      idProduct: 1,
      name: 'Martillo',
      description: 'Martillos de alta calidad',
      stock: 10,
      criticalStock: 1,
      status: true,
      isFungible: true
    },
    {
      idProduct: 2,
      name: 'Alicate',
      description: 'Alicate multifuncional',
      stock: 6,
      criticalStock: 1,
      status: true,
      isFungible: true
    },
    {
      idProduct: 3,
      name: 'Tornillos',
      description: 'Tornillos variados',
      stock: 40,
      criticalStock: 1,
      status: true,
      isFungible: true
    },
    {
      idProduct: 4,
      name: 'Confort',
      description: 'Confort para mascotas',
      stock: 10,
      criticalStock: 1,
      status: true,
      isFungible: true
    },
    {
      idProduct: 5,
      name: 'Cloro',
      description: 'Cloro de limpieza',
      stock: 10,
      criticalStock: 1,
      status: true,
      isFungible: true
    }
  ];



  constructor() { }

  getProducts(): Product[]{
    return this.products
  }

  deleteProduct(idProduct: number): void {
    this.products = this.products.filter(product => product.idProduct !== idProduct);
  }

}
