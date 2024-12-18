import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  User,
  UserAssitant,
  UserEdit,
  UserRegister,
  UserStudent,
  UserTeacher,
  userToken,
} from '../models/user.interface';
import { Degree } from '../models/degree.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/users';
  private apiUrlQr = 'http://localhost:3000/qr-code';

  /**
   *Función que recibe un usuario y lo ingresa en la base de datos.
   *
   * @param {UserRegister} user
   * @return {*}
   * @memberof UserService
   */
  public register(user: UserRegister) {
    return this.http.post(`${this.apiUrl}`, user);
  }
  /**
   *Función que devuelve una lista de tipo Estudiante de todos los usuarios de ese tipo registrados en la base de datos.
   *
   * @return {*}  {Observable<UserStudent[]>}
   * @memberof UserService
   */
  public getAllStudents(): Observable<UserStudent[]> {
    return this.http.get<UserStudent[]>(`${this.apiUrl}/students`);
  }

  public getAllStudentsEliminated(): Observable<User[]>{
    const s = this.http.get<User[]>(`${this.apiUrl}/eliminated`);
    return s;
  }
  /**
   *Función que devuelve una lsita de tipo Profesor de todos los usuarios de ese tipo registrados en la base de datos.
   *
   * @return {*}  {Observable<UserTeacher[]>}
   * @memberof UserService
   */
  public getAllTeachers(): Observable<UserTeacher[]> {
    return this.http.get<UserTeacher[]>(`${this.apiUrl}/teachers`);
  }
  /**
   *Función que recibe una lista de tipo Asistente de todos los usuarios de ese tipo registrados en la base de datos.
   *
   * @return {*}  {Observable<UserAssitant[]>}
   * @memberof UserService
   */
  public getAllAssistants(): Observable<UserAssitant[]> {
    return this.http.get<UserAssitant[]>(`${this.apiUrl}/assistants`);
  }
  /**
   *Función que recibe todas las carreras registradas en la base de datos.
   *
   * @return {*}  {Observable<Degree[]>}
   * @memberof UserService
   */
  public getAllDegrees(): Observable<Degree[]> {
    const response = this.http.get<Degree[]>(`${this.apiUrl}/degrees`);
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
    return this.http.get<User>(`${this.apiUrl}/user/${id}`);
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
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
  /**
   *Función que recibe un id de un usuario y lo elimina de la base de datos.
   *
   * @param {number} id
   * @return {*}
   * @memberof UserService
   */
  public deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  /**
   *Función que recibe la información de los usuarios a importar y los agrega masivamente en la base de datos.
   *
   * @param {FormData} data
   * @return {*}
   * @memberof UserService
   */
  public importUsers(data: FormData) {
    return this.http.post(`${this.apiUrl}/import`, data);
  }
/**
 * Función que recibe un token de Qr para poder enviarlo al backend y obtener el usuario asociado a ese token.
 *
 * @param {string} qrCode
 * @return {*}  {Observable<User>}
 * @memberof UserService
 */
public readCode(qrCode: string): Observable<User> {
    const params = new HttpParams().set('token', qrCode);
    return this.http.get<User>(`${this.apiUrlQr}/decode`, { params });
  }
/**
 * Función que recibe el rut de un usuario y devuelve del backend el token de Qr asociado a ese usuario.
 *
 * @param {string} rut
 * @return {*}  {Observable<userToken>}
 * @memberof UserService
 */
public getCode(rut: string): Observable<userToken> {
    return this.http.post<userToken>(`${this.apiUrlQr}/generate`, { rut });
  }
/**
 * Fució para enviar el código Qr por un usuario en particular, para esto debe recibir el token de Qr y el email a enviar.
 *
 * @param {string} token
 * @param {string} email
 * @return {*}
 * @memberof UserService
 */
public sendCodeByUser(token: string, email: string) {
    return this.http.post(`${this.apiUrlQr}/temporary`, {token: token, mail: email});
  }
/**
 * Función que envía al backend la acción de enviar códigos qr a todos los usuarios registrados de la base de datos.
 *
 * @return {*}
 * @memberof UserService
 */
public sendToEveryoneQr(){
    return this.http.post(`${this.apiUrlQr}/send-all`, null);
}

}
