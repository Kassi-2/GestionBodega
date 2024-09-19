import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public products: Product[] = [
    {
      idProduct: 1,
      name: 'Martillo',
      description: 'Marca XXXX',
      stock: 2,
      criticalStock: 1,
      status: true,
      isFungible: false,
    },
    {
      idProduct: 2,
      name: 'Destornillador',
      description: 'Marca XXXX',
      stock: 5,
      criticalStock: 2,
      status: true,
      isFungible: true,
    },
  ];

  getProducts(): Product[] {
    return this.products;
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
