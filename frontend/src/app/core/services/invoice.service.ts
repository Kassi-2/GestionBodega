import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  private api = 'http://localhost:3000/invoices';

  public getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.api}`);
  }

  public getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.api}/${id}`);
  }

  public deleteInvoice(id: number): Observable<Invoice> {
    return this.http.delete<Invoice>(`${this.api}/${id}`);
  }
}
