import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/alert';

  public getDailyAlert(): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/today`);
  }

  public getAllAlert(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}`);
  }
}
