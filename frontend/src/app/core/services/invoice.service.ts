import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterInvoices, Invoice, NewInvoice } from '../models/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/invoices';

  public addInvoice(data: NewInvoice) {
    const formData = new FormData();

    const shipmentDate = new Date(data.shipmentDate);
    const registrationDate = new Date(data.registrationDate);

    formData.append('purchaseOrderNumber', data.purchaseOrderNumber);
    formData.append('shipmentDate', shipmentDate.toISOString().split('T')[0]); // Convertir a ISO String
    if (registrationDate) {
      formData.append('registrationDate', registrationDate.toISOString().split('T')[0]);
    }

    const categoryIds = data.invoiceCategory;
    formData.append('categoryIds', JSON.stringify(categoryIds));



    if (data.file) {
      formData.append('file', data.file);
    }


    return this.http.post(`${this.apiUrl}/upload`, formData);
  }


  public getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}`);
  }

  public getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  public deleteInvoice(id: number): Observable<Invoice> {
    return this.http.delete<Invoice>(`${this.apiUrl}/${id}`);
  }

  public downloadInvoice(invoiceId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${invoiceId}`, {
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
    return this.http.get<Invoice[]>(`${this.apiUrl}/filter/filter`, { params });;
  }


  public updateInvoice(invoice: Invoice): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/lending-id/${invoice}`);
  }
}

