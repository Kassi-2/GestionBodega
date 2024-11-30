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
