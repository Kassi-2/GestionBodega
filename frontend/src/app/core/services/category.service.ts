import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CategoryRegister } from '../models/category.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/category';

  public createCategory(category: CategoryRegister): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  public getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  public editCategory(category: Category, id: number): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  public deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.apiUrl}/${id}`);
  }
}
