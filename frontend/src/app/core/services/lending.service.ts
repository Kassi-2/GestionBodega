import { contains, Lending, LendingProduct, newLending } from './../models/lending.interface';
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

  public getLendingForEdit(id: number): Observable<Lending> {
    return this.http.get<Lending>(`${this.apiUrl}/lending-id/${id}`);
  }

  public deleteLending(id: number): Observable<Lending> {
    return this.http.delete<Lending>(`${this.apiUrl}/delete/${id}`);
}

  public getFilteredLendings(lending: string): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/teachers`);
}
  public getLendingPending(): Observable<Lending[]>{
    return this.http.get<Lending[]>(`${this.apiUrl}/pending-lending`);
  }

  public getLendingFinish(): Observable<Lending[]>{
    return this.http.get<Lending[]>(`${this.apiUrl}/finalized-lending-max`);
  }

  public getLendingInactive(): Observable<Lending[]>{
    return this.http.get<Lending[]>(`${this.apiUrl}/eliminated-lending`);
  }

  public lendingActiveForDate(date: string): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/lending-create-date/${date}`);
  }

  public lendingPendingForDate(date: string): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/lending-create-date/${date}`);
  }

  public lendingFinishForDate(date: string): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/lending-finalize-date/${date}`);
  }

  public lendingInactiveForDate(date: string): Observable<Lending[]> {
    return this.http.get<Lending[]>(`${this.apiUrl}/lending-inactive-date/${date}`);
  }

  public lendingFinish(id: number, comments: string): Observable<Lending> {
    return this.http.put<Lending>(`${this.apiUrl}/finalize-lending/${id}`, {comments: comments});
  }

  public updateLendingPending(id: number): Observable<Lending> {
    return this.http.put<Lending>(`${this.apiUrl}/active-pending/${id}`, {});
  }

  public getHistoryProducts(id: number): Observable<Lending[]>{
    return this.http.get<Lending[]>(`${this.apiUrl}/product/${id}`);
  }

  public lendingForName(name: string): Observable<Lending[]>{
    return this.http.get<Lending[]>(`${this.apiUrl}/finalized/${name}`);
  }

  public updateLendingDisrepair(id: number) {
    return this.http.put<Lending>(`${this.apiUrl}/${id}/unmark-as-problematic`, {});
  }

  public markAsProblematic(id: number){
    return this.http.put<Lending>(`${this.apiUrl}/${id}/mark-as-problematic`, {});
  }

  /**
   * Función para enviar el préstamo creado por el usuario al backend.
   *
   * @param {newLending} lending
   * @return {*}
   * @memberof LendingService
   */
  public addLending(lending: newLending) {
    this.currentStep = new BehaviorSubject<number>(1);
    return this.http.post<Lending>(`${this.apiUrl}`, lending);
  }

  public addLendingPending(lending: newLending) {
    this.currentStep = new BehaviorSubject<number>(1);
    return this.http.post(`${this.apiUrl}/`, lending);
  }

  /**
   * Función para almacenar la información del préstamo almacenado.
   *
   * @param {(contains[] | null)} Contains
   * @memberof LendingService
   */
  setContains(Contains: contains[] | null) {
    this.containsSubject.next(Contains);
  }

  /**
   * Función para obtener la información del préstamo almacenado temporalmente.
   *
   * @return {*}
   * @memberof LendingService
   */
  getLastLending() {
    return this.containsSubject.asObservable();
  }

  /**
   * Función para almacenar el paso de la creación de un préstamo.
   *
   * @param {number} step
   * @memberof LendingService
   */
  setCurrentStep(step: number) {
    this.currentStep.next(step);
  }

  /**
   * Función para recuperar el paso de la creación de un préstamo en el que el usuario se quedó.
   *
   * @return {*}
   * @memberof LendingService
   */
  getCurrentStep() {
    return this.currentStep.asObservable();
  }

  /**
   * Función para recuperar el usuario almacenado.
   *
   * @return {*}
   * @memberof LendingService
   */
  getSelectedUser() {
    return this.selectedUser.asObservable();
  }

  /**
   * Función para definir el usuario seleccionado para almacenarlo en el servicio.
   *
   * @param {(User | null)} user
   * @memberof LendingService
   */
  setSelectedUser(user: User | null) {
    this.selectedUser.next(user);
  }

}
