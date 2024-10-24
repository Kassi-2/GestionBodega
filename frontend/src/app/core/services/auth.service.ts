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

  public login(user: UserLogin) {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

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

  public logout(): boolean {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      return true;
    }
    return false;
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  public getToken() {
    const token = localStorage.getItem('token');
    return token;
  }
}
