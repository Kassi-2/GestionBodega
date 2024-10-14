import { Contains, Lending } from './../models/lending.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  private containsSubject = new BehaviorSubject<Contains[]>([]);


  public addLending(Lending: Lending) {
    return this.http.post(`${this.apiUrl}`, Lending);
  }

  setContains(contains: Contains) {
    this.containsSubject.next(contains);
  }

  getLending() {
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

  setSelectedUser(user: User) {
    this.selectedUser.next(user);
  }


}
