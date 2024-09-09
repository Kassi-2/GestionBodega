import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public products = new Array<Product>

  constructor() {
    this.products = [
      new Product(1, 'Martillo', 'Marca XXXX', 2, 1, 'active', 'available')
    ];
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

}
