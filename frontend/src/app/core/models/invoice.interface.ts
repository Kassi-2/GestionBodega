import { Category } from './category.interface';

export interface Invoice {
  id: number;
  state: boolean;
  purchaseOrderNumber: string;
  shipmentDate: Date;
  registrationDate: Date;
  invoiceCategory: InvoiceCategory[];
}

export interface InvoiceCategory {
  invoice: Invoice;
  category: Category;
}

export interface FilterInvoices {
  startDate?: string; 
  endDate?: string; 
  categories?: number[];
}
export interface newInvoice {
  purchaseOrderNumber: string;
  shipmentDate: Date;
  registrationDate: Date;
  invoiceCategory: InvoiceCategory[];
  file: File
}