import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Invoice } from '../../../core/models/invoice.interface';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../../core/models/category.interface';
import { InvoiceService } from '../../../core/services/invoice.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [NgbPagination, CommonModule],
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

  public getCategories(invoice: Invoice) {
    let categories = '';

    invoice.invoiceCategory.forEach((category) => {
      categories = categories + category.category.name + '\n';
    });

    console.log(categories);
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
}
