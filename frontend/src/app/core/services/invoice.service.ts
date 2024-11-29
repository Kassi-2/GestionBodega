import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/invoice';

  public addInvoice(invoice: Invoice){
    return this.http.post<Invoice>(`${this.apiUrl}`, invoice);
  }
}
