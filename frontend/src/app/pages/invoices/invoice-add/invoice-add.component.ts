import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.interface';
import { InvoiceService } from '../../../core/services/invoice.service';
import { NewInvoice } from '../../../core/models/invoice.interface';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invoice-add.component.html',
})
export class InvoiceAddComponent implements OnInit {
  invoiceForm!: FormGroup;
  public categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const formattedDate = today.toISOString().split('T')[0];

    this.invoiceForm = this.fb.group({
      purchaseOrderNumber: ['', Validators.required],
      shipmentDate: [formattedDate, Validators.required],
      registrationDate: [formattedDate, Validators.required],
      invoiceFile: [null, Validators.required],
      categories: [[], Validators.required],
    });

    this.getAllCategories();
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const invoice: NewInvoice = {
      purchaseOrderNumber: this.invoiceForm.value.purchaseOrderNumber,
      shipmentDate: this.invoiceForm.value.shipmentDate,
      registrationDate: this.invoiceForm.value.registrationDate,
      invoiceCategory: this.invoiceForm.value.categories,

      file: this.invoiceForm.value.invoiceFile,
    };

    const file = this.invoiceForm.get('invoiceFile')?.value;

    Swal.fire({
      title: `Guardando la factura: ${invoice.purchaseOrderNumber}`,
      text: 'Espere mientras se procesa el guardado',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    Swal.showLoading();

    this.invoiceService.addInvoice(invoice).subscribe({
      next: () => {
        Swal.close();

        Swal.fire({
          title: 'Factura agregada',
          text: `Factura agregada exitosamente al sistema.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => {
          location.reload();
        }, 1500);
      },
      error: (error) => {
        Swal.close();

        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        });
      },
    });
  }

  get notValidpurchaseOrderNumber() {
    return (
      this.invoiceForm.get('purchaseOrderNumber')?.invalid &&
      this.invoiceForm.get('purchaseOrderNumber')?.touched
    );
  }

  get notValidFile() {
    return (
      this.invoiceForm.get('file')?.invalid &&
      this.invoiceForm.get('file')?.touched
    );
  }

  onCategoryChange(event: any, categoryId: number): void {
    const selectedCategories = this.invoiceForm.get('categories')
      ?.value as number[];

    if (event.target.checked) {
      selectedCategories.push(categoryId);
    } else {
      const index = selectedCategories.indexOf(categoryId);
      if (index > -1) {
        selectedCategories.splice(index, 1);
      }
    }
    this.invoiceForm.patchValue({ categories: selectedCategories });
    this.invoiceForm.get('categories')?.updateValueAndValidity();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.invoiceForm.patchValue({ invoiceFile: file });
      this.invoiceForm.get('invoiceFile')?.setErrors(null);
    } else {
      this.invoiceForm.patchValue({ invoiceFile: null });
      this.invoiceForm.get('invoiceFile')?.setErrors({ invalidFileType: true });
    }
  }

  private getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (result) => {
        this.categories = result;
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  get notValidOrderNumber() {
    return (
      this.invoiceForm.get('purchaseOrderNumber')?.invalid &&
      this.invoiceForm.get('purchaseOrderNumber')?.touched
    );
  }

  get notValidCategories() {
    return (
      this.invoiceForm.get('categories')?.invalid &&
      this.invoiceForm.get('categories')?.touched
    );
  }
}
