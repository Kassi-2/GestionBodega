import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public products = new Array<Product>

  constructor() {
    this.products = [
      new Product(1, 'Martillo', 'Marca XXXX', 2, 1, true, false),
      new Product(2, 'Destornilaldor', 'Marca XXXX', 2, 1, true, true)
    ];
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  getIDLastProduct(): Observable<number> {
    const last = this.products.length ? this.products[this.products.length - 1].idProduct : 0;
    return of(last);
  }

}
