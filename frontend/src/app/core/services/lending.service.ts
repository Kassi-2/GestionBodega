import { Lending, lendingProducts } from './../models/lending.interface';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserTeacher } from '../models/user.interface';
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
  private containsSubject = new BehaviorSubject<lendingProducts[] | null>(null);

  public getLending(): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/active-lending`);
  }

  public deleteLending(id:number): Observable<Lending> {
    return this.http.delete<Lending>(`${this.apiUrl}/lending/${id}`);
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

  public addLending(Lending: Lending) {
    return this.http.post(`${this.apiUrl}`, Lending);
  }

  setContains(contains: lendingProducts[] | null) {
    this.containsSubject.next(contains);
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
