import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product, NewProduct } from '../models/product.interface';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/products';

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/active-name-asc`);
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, updatedProduct);
  }

  deleteProduct(idProduct: number) {
    return this.http.delete(`${this.apiUrl}/${idProduct}`);
  }

  getProductForEdit(idProduct: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${idProduct}`);
  }

  addProduct(product: NewProduct) {
    return this.http.post(`${this.apiUrl}`, product);
  }


}
