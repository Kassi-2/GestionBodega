import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  User,
  UserAssitant,
  UserEdit,
  UserRegister,
  UserStudent,
  UserTeacher,
} from '../models/user.interface';
import { Degree } from '../models/degree.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/users';

  public register(user: UserRegister) {
    return this.http.post(`${this.apiUrl}`, user);
  }

  public getAllStudents(): Observable<UserStudent[]> {
    return this.http.get<UserStudent[]>(`${this.apiUrl}/students`);
  }

  public getAllTeachers(): Observable<UserTeacher[]> {
    return this.http.get<UserTeacher[]>(`${this.apiUrl}/teachers`);
  }

  public getALLAssistants(): Observable<UserAssitant[]> {
    return this.http.get<UserAssitant[]>(`${this.apiUrl}/assistants`);
  }

  public getAllDegrees(): Observable<Degree[]> {
    const response = this.http.get<Degree[]>(`${this.apiUrl}/degrees`);
    return response;
  }

  public getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}`);
  }

  public updateUser(id: number, user: UserEdit): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  public deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  public importUsers(data: FormData) {
    return this.http.post(`${this.apiUrl}/import`, data);
  }
}