<<<<<<< HEAD
import { Injectable } from '@angular/core';
import { Invoice, newInvoice } from '../models/invoice.interface';
import { HttpClient } from '@angular/common/http';
=======
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterInvoices, Invoice } from '../models/invoice.interface';
>>>>>>> origin/dev5-leandro

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
<<<<<<< HEAD
  private apiUrl = 'http://localhost:3000/invoice';

  public addInvoice(invoice: newInvoice){
    return this.http.post<Invoice>(`${this.apiUrl}`, invoice);
=======
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

  public downloadInvoice(invoiceId: number): Observable<Blob> {
    return this.http.get(`${this.api}/download/${invoiceId}`, {
      params: { id: invoiceId },
      responseType: 'blob', // Indica que la respuesta será un Blob
    });
  }

  public filterInvoices(filters: FilterInvoices): Observable<Invoice[]> {
    let params = new HttpParams();

    if (filters.startDate) {
      params = params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.append('endDate', filters.endDate);
    }
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach((category) => {
        params = params.append('categories', category);
      });
    }
    return this.http.get<Invoice[]>(`${this.api}/filter/filter`, { params });;
>>>>>>> origin/dev5-leandro
  }
  public getInvoiceById(idInvoice: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/lending-id/${idInvoice}`);
  }

  public updateInvoice(invoice: Invoice): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/lending-id/${invoice}`);
  }
}
}
