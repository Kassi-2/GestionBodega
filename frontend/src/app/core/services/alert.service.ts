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
    console.log(now)
    const alertData = {
      name: 'Alerta diaria',
      description: 'Alerta creada',
      state: true,
      date: new Date()
    };
    return this.http.post<Alert>(`${this.apiUrl}`, alertData);
  }

  public getAllAlert(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}`);
  }
}
