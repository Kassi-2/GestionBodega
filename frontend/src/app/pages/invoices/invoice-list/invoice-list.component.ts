import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Invoice } from '../../../core/models/invoice.interface';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../../core/models/category.interface';
import { InvoiceService } from '../../../core/services/invoice.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { InvoicesEditComponent } from "../invoices-edit/invoices-edit.component";

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [NgbPagination, CommonModule, InvoicesEditComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  ngOnInit(): void {}
  ngOnDestroy(): void {}

  constructor(private invoiceService: InvoiceService) {}

  @Input() invoices: Invoice[] = [];
  public page = 1;
  public pageSize = 10;
  invoiceId!: number;

  public getCategories(invoice: Invoice) {
    let categories = '';

    invoice.invoiceCategory.forEach((category) => {
      categories = categories + category.category.name + '\n';
    });
    return categories;
  }

  public deleteInvoice(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `!Estás a punto de eliminar a la categoría ${id}!.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      confirmButtonColor: 'green',
      cancelButtonText: 'No, Cancelar',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.deleteInvoice(id).subscribe({
          next: (response: Invoice) => {
            Swal.fire({
              title: '¡Eliminado!',
              text: `La factura Nº${response.purchaseOrderNumber} ha sido eliminada exitosamente.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });

            location.reload();
          },
          error: (error) => {
            Swal.fire({
              title: 'Ha ocurrido un error',
              text: error.error.message,
              icon: 'error',
              timer: 1500,
              showConfirmButton: false,
            });
          },
        });
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'La factura no se ha eliminado.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  public async downloadInvoice(invoiceId: number) {
    Swal.fire({
      title: 'Preparando el archivo',
      text: 'Por favor espere un momento.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    const invoice = this.invoices.find((invoice) => invoice.id === invoiceId);
    this.invoiceService.downloadInvoice(invoiceId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${invoice?.purchaseOrderNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        Swal.close();
        Swal.fire({
          title: 'Agregada!',
          text: `La factura ${invoice?.purchaseOrderNumber} ha sido descargada de forma exitosa`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Error descargando la factura:', err);
        alert('No se pudo descargar la factura. Inténtalo de nuevo.');
        Swal.close();
      },
    });
  }

  setInvoiceId(invoiceId: number){
    this.invoiceId = invoiceId;
  }
}
