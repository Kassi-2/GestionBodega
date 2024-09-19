import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';


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
      isFungible: false
    },
    {
      idProduct: 2,
      name: 'Alicate',
      description: 'Alicate multifuncional',
      stock: 6,
      criticalStock: 2,
      status: true,
      isFungible: false
    },
    {
      idProduct: 3,
      name: 'Tornillos',
      description: 'Tornillos variados',
      stock: 40,
      criticalStock: 1,
      status: true,
      isFungible: false
    },
    {
      idProduct: 4,
      name: 'Confort',
      description: 'Confort para mascotas',
      stock: 0,
      criticalStock: 1,
      status: true,
      isFungible: true
    },
    {
      idProduct: 5,
      name: 'Cloro',
      description: 'Cloro de limpieza',
      stock: 10,
      criticalStock: 3,
      status: true,
      isFungible: true
    }
  ];



  constructor() { }

  getProducts(): Product[]{
    return this.products
  }

  updateProduct(updatedProduct: Product): Observable<Product> {
    const index = this.products.findIndex(product => product.idProduct === updatedProduct.idProduct);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
    }

    return of(this.products[index]);
  }

  nameUnique(name: string, idProduct?: number): boolean {
    return !this.products.some(product => product.name === name && product.idProduct !== idProduct);
  }

  deleteProduct(idProduct: number): void {
    this.products = this.products.filter(product => product.idProduct !== idProduct);
  }

  getProductForEdit(idProduct: number): Product | undefined {
    return this.products.find(product => product.idProduct === idProduct);
  }
  addProduct(product: Product): void {
    this.products.push(product);
  }

  getIDLastProduct(): Observable<number> {
    const last = this.products.length
      ? this.products[this.products.length - 1].idProduct
      : 0;
    return of(last);
  }

  checkProductExists(name: string): Observable<boolean> {
    const exists = this.products.some((product) => product.name === name);
    return of(exists);
  }

}
