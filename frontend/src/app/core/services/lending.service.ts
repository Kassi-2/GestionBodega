import { contains, Lending, lendingProducts, newLending } from './../models/lending.interface';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class LendingService {


  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/lending';
  private currentStep = new BehaviorSubject<number>(1);
  private selectedUser = new BehaviorSubject<User | null>(null);
  private containsSubject = new BehaviorSubject<contains[] | null>(null);

  public getLending(): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/active-lending`);
  }

  public deleteLending(id: number): Observable<Lending> {
    return this.http.delete<Lending>(`${this.apiUrl}/${id}`);
}

  public getFilteredLendings(lending: string): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/teachers`);
}

  public getLendingFinish(): Observable<Lending[]>{
    return this.http.get<Lending[]>(`${this.apiUrl}/finalized-lending-max`);
  }

  public getLendingInactive(): Observable<Lending[]>{
    return this.http.get<Lending[]>(`${this.apiUrl}/eliminated-lending`);
  }

  public lendingForDate(date:Date): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/lending-create-date/${date}`);
}

  public lendingFinish(id: number, comment: string): Observable<Lending> {
    return this.http.put<Lending>(`${this.apiUrl}/finalize-lending/${id}`, comment);
  }

  public addLending(lending: newLending) {
    this.currentStep = new BehaviorSubject<number>(1);
    return this.http.post(`${this.apiUrl}`, lending);
  }

  setContains(Contains: contains[] | null) {
    this.containsSubject.next(Contains);
  }

  getLastLending() {
    return this.containsSubject.asObservable();
  }

  setCurrentStep(step: number) {
    this.currentStep.next(step);
  }

  getCurrentStep() {
    return this.currentStep.asObservable();
  }

  getSelectedUser() {
    return this.selectedUser.asObservable();
  }

  setSelectedUser(user: User | null) {
    this.selectedUser.next(user);
  }

}
