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
  /**
   *Función que recibe un usuario y lo ingresa en la base de datos.
   *
   * @param {UserRegister} user
   * @return {*}
   * @memberof UserService
   */
  public register(user: UserRegister) {
    return this.http.post(`${this.apiUrl}`, user,{headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
  /**
   *Función que devuelve una lista de tipo Estudiante de todos los usuarios de ese tipo registrados en la base de datos.
   *
   * @return {*}  {Observable<UserStudent[]>}
   * @memberof UserService
   */
  public getAllStudents(): Observable<UserStudent[]> {
    return this.http.get<UserStudent[]>(`${this.apiUrl}/students`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
  /**
   *Función que devuelve una lsita de tipo Profesor de todos los usuarios de ese tipo registrados en la base de datos.
   *
   * @return {*}  {Observable<UserTeacher[]>}
   * @memberof UserService
   */
  public getAllTeachers(): Observable<UserTeacher[]> {
    return this.http.get<UserTeacher[]>(`${this.apiUrl}/teachers`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
  /**
   *Función que recibe una lista de tipo Asistente de todos los usuarios de ese tipo registrados en la base de datos.
   *
   * @return {*}  {Observable<UserAssitant[]>}
   * @memberof UserService
   */
  public getAllAssistants(): Observable<UserAssitant[]> {
    return this.http.get<UserAssitant[]>(`${this.apiUrl}/assistants`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
  /**
   *Función que recibe todas las carreras registradas en la base de datos.
   *
   * @return {*}  {Observable<Degree[]>}
   * @memberof UserService
   */
  public getAllDegrees(): Observable<Degree[]> {
    const response = this.http.get<Degree[]>(`${this.apiUrl}/degrees`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
    return response;
  }
  /**
   *Función que recibe un id y devuelve la información del usuario correspondiente.
   *
   * @param {number} id
   * @return {*}  {Observable<User>}
   * @memberof UserService
   */
  public getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
  /**
   *Función que recibe el id y la información actualizada de un usuario para actualizarlo en la base de datos.
   *
   * @param {number} id
   * @param {UserEdit} user
   * @return {*}  {Observable<User>}
   * @memberof UserService
   */
  public updateUser(id: number, user: UserEdit): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
  /**
   *Función que recibe un id de un usuario y lo elimina de la base de datos.
   *
   * @param {number} id
   * @return {*}
   * @memberof UserService
   */
  public deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
  /**
   *Función que recibe la información de los usuarios a importar y los agrega masivamente en la base de datos.
   *
   * @param {FormData} data
   * @return {*}
   * @memberof UserService
   */
  public importUsers(data: FormData) {
    return this.http.post(`${this.apiUrl}/import`, data, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
}
