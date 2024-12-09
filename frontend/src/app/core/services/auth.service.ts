import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../models/user.interface';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/auth';

  /**
   * Inicia sesión para un usuario.
   * Envía una solicitud POST al servidor con las credenciales del usuario.
   * Almacena el token de acceso en el almacenamiento local si la autenticación es exitosa.
   *
   * @param {UserLogin} user - Objeto con las credenciales de inicio de sesión.
   * @return {*}  {Observable<any>}
   * @memberof AuthService
   */
  public login(user: UserLogin) {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  /**
   * Verifica si el usuario ha iniciado sesión.
   * Comprueba si hay un token en el almacenamiento local y si no ha expirado.
   * Si el token ha expirado, se elimina automáticamente.
   *
   * @return {*}  {boolean} - `true` si el usuario está autenticado y el token es válido; de lo contrario, `false`.
   * @memberof AuthService
   */
  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const isExpired = this.isTokenExpired(token);
    if (isExpired) {
      this.logout();
      return false;
    }
    return true;
  }

  /**
   * Cierra la sesión del usuario.
   * Elimina el token de autenticación del almacenamiento local.
   *
   * @return {*}  {boolean} - `true` si el token existía y fue eliminado; `false` si no había token.
   * @memberof AuthService
   */
  public logout(): boolean {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      return true;
    }
    return false;
  }

  /**
   * Verifica si el token de autenticación ha expirado.
   * Decodifica el token y compara el tiempo actual con el tiempo de expiración del token.
   *
   * @private
   * @param {string} token - El token JWT a verificar.
   * @return {*}  {boolean} - `true` si el token ha expirado; `false` si el token es válido.
   * @memberof AuthService
   */
  public isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  /**
   * Obtiene el token de autenticación almacenado.
   * Recupera el token JWT del almacenamiento local si está presente.
   *
   * @return {*}  {(string | null)} - El token JWT si está presente; `null` si no hay token almacenado.
   * @memberof AuthService
   */
  public getToken() {
    const token = localStorage.getItem('token');
    return token;
  }

  public requestPasswordReset(mail: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/request-password-reset`,
      { mail }
    );
  }

  public resetPassword(
    token: string,
    newPassword: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      {
        token,
        newPassword,
      }
    );
  }

  public verifyCode(token: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-code`, {
      token,
    });
  }
}
