import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../models/user.interface';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router,) {
    this.checkTokenExpiration();
  }
  private apiUrl = 'http://localhost:3000/auth';

  public login(user: UserLogin) {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(tap((response) => {
      sessionStorage.setItem('token', response.access_token);
    }));
  };

  public isAuth(): Observable<boolean> {
    let token = sessionStorage.getItem('token');
    if (token) {
      return of(true);
    }
    console.log("aqui deberia redirigir")
    this.router.navigateByUrl('/auth/login');
    return of(false);
  }

  public isLoggedIn(): Observable<boolean> {
    let token = sessionStorage.getItem('token');
    if (!token) {
      console.log('entre a falso');
      this.router.navigateByUrl('/auth/login');
      return of(false);
    }
    return of(true);
  }

  private checkTokenExpiration() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const expirationTimeInSeconds: number = decodedToken.exp;
      const currentTimeInSeconds: number = Math.floor(Date.now() / 1000);

      if (currentTimeInSeconds > expirationTimeInSeconds) {
        this.logout();
        this.router.navigateByUrl('login');
      }
    }
  }

  public logout(): boolean {
    if (sessionStorage.getItem('token')) {
      sessionStorage.removeItem('token');
      return true;
    }
    return false;
  }
}
