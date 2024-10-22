import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/alerts';

  public createAlert(): Observable<Alert> {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    const alertData = {
      name: `Alerta ${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`,
      description: '',
      state: false,
      date: date,
    };
    return this.http.post<Alert>(`${this.apiUrl}`, alertData, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }

  public getAllAlert(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }

  public markAlertAsViewed(alertId: number): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/${alertId}`, {}, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }

  public deleteAlert(alertId: number): Observable<Alert> {
    return this.http.delete<Alert>(`${this.apiUrl}/${alertId}`, {headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }});
  }
}
