import { Lending } from './../models/lending.interface';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserTeacher } from '../models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class LendingService {


  private activeLendings: Lending[] = [
    { id: 1, borrowerId: 3, borrowerName: "Lukas martin", teacherName: "Martin Lukas", teacherId: 1, date: new Date('2023-08-03'), state: "false", comments: "hola",
      lendingProducts:[{ lendingId: 1, name: "martillo", productId: 1, amount: 2 },
        { lendingId: 1, name: "cloro",productId: 4, amount: 5 }]},

    { id: 2, borrowerId: 5, borrowerName: "Andres soprano", teacherName: "soprano andres", teacherId: 4, date: new Date('2023-04-10'), state: "true", comments: "hola 2",
      lendingProducts:[{ lendingId: 2, name: "tetera", productId: 2, amount: 2 },
        { lendingId: 2, name: "confort",productId: 5, amount: 2 }]},

    { id: 3, borrowerId: 1, borrowerName: "pargela alumno", teacherName: "pargela profe", teacherId: null, date: new Date('2023-10-34'), state: "true", comments: "hola 3",
      lendingProducts:[{ lendingId: 3, name: "tornillo", productId: 3, amount: 2 },
        { lendingId: 3, name: "cartulina", productId: 6, amount: 3 }]},
  ];

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/users';

  getLending(): Observable<Lending[]> {
    return of(this.activeLendings);
  }

  public getAllTeachers(): Observable<UserTeacher[]> {
    return this.http.get<UserTeacher[]>(`${this.apiUrl}/teachers`);
  }

  // para saber el nombre del prestatario, obtiene del servicio user.service.ts
}
