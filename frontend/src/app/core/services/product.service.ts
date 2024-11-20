import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product, NewProduct } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/products';
  private idProduct = new BehaviorSubject<number>(0);
    /**
   *Función que devuelve un observable con todos los productos registrados en la base de datos.
   *
   * @return {*}  {Observable<Product[]>}
   * @memberof ProductService
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/active-name-asc`);
  }

  getProductsInactive(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/eliminated`);
  }

  getAvailableProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/available`);
  }
  /**
   *Función que recibe un producto y actualiza los cambios realizados en la base de datos.
   *
   * @param {number} id
   * @param {Product} updatedProduct
   * @return {*}  {Observable<Product>}
   * @memberof ProductService
   */
  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    console.log(updatedProduct);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, updatedProduct);
  }
  /**
   *Función que recibe el id de un producto para luego eliminarlo de la base de datos.
   *
   * @param {number} idProduct
   * @return {*}
   * @memberof ProductService
   */
  deleteProduct(idProduct: number) {
    return this.http.delete(`${this.apiUrl}/${idProduct}`);
  }
  /**
   *Función que recibe el id de un producto y devuelve la información del mismo para poder editarlo.
   *
   * @param {number} idProduct
   * @return {*}  {Observable<Product>}
   * @memberof ProductService
   */
  getProductForEdit(idProduct: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${idProduct}`);
  }
  /**
   *Función que recibe un producto y que lo agrega en la base de datos.
   *
   * @param {NewProduct} product
   * @return {*}
   * @memberof ProductService
   */
  addProduct(product: NewProduct) {
    console.log(product);
    return this.http.post(`${this.apiUrl}`, product);
  }

  /**
   *Función que recibe un tipo de ordenamiento y devuelve un listado de los productos acorde al ordenamiento solicitado.
   *
   * @param {string} option
   * @return {*}  {Observable<Product[]>}
   * @memberof ProductService
   */
  filterListProduct(option: string): Observable<Product[]> {
    if (option === 'A-Z') {
      return this.http.get<Product[]>(`${this.apiUrl}/active-name-asc`);
    } else if (option === 'Z-A') {
      return this.http.get<Product[]>(`${this.apiUrl}/active-name-desc`);
    } else if (option === 'De mayor a menor stock') {
      return this.http.get<Product[]>(`${this.apiUrl}/active-stock-desc`);
    } else if (option === 'De menor a mayor stock') {
      return this.http.get<Product[]>(`${this.apiUrl}/active-stock-asc`);
    } else {
      return this.http.get<Product[]>(`${this.apiUrl}/active-name-asc`);
    }
  }
  setIdProduct(id: number){
    this.idProduct.next(id)
    console.log(this.idProduct.asObservable())
  }

  getIdProduct(){
    console.log(this.idProduct.asObservable())
    return this.idProduct.asObservable();
  }
}
