import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  UserAssitant,
  UserRegister,
  UserStudent,
  UserTeacher,
} from '../models/user.interface';
import { Degree } from '../models/degree.interface';
import { Observable } from 'rxjs';

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
    const response = this.http.get<UserStudent[]>(`${this.apiUrl}/students`);
    return response;
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
}
