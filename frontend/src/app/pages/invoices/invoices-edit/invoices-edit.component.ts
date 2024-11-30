import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.interface';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice, newInvoice } from '../../../core/models/invoice.interface';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invoices-edit.component.html',
  styleUrl: './invoices-edit.component.css'
})
export class InvoicesEditComponent {
  userForm!: FormGroup;
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


    this.userForm = this.fb.group({
      purchaseOrderNumber: ['', Validators.required],
      shipmentDate: [formattedDate, Validators.required],
      registrationDate: [formattedDate, Validators.required],
      invoiceFile: [null, Validators.required],
      categories: [[], Validators.required],
    });

    this.getAllCategories();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const invoice: newInvoice = {
      purchaseOrderNumber: this.userForm.value.purchaseOrderNumber,
      shipmentDate: this.userForm.value.shipmentDate,
      registrationDate: this.userForm.value.registrationDate,
      invoiceCategory: this.userForm.value.categories.map((categoryId: number) => ({
        invoice: null,
        category: { id: categoryId } as Category
      })),
      file: this.userForm.value.invoiceFile
    };

    console.log(invoice)

    this.invoiceService.addInvoice(invoice).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Factura creada!',
          text: 'La factura ha sido creada con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al crear la factura.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
        console.error(error);
      },
    });
  }

  get notValidpurchaseOrderNumber() {
    return (
      this.userForm.get('purchaseOrderNumber')?.invalid &&
      this.userForm.get('purchaseOrderNumber')?.touched
    );
  }

  get notValidFile() {
    return (
      this.userForm.get('file')?.invalid &&
      this.userForm.get('file')?.touched
    );
  }


  onCategoryChange(event: any, categoryId: number): void {
    const selectedCategories = this.userForm.get('categories')?.value as number[];

    if (event.target.checked) {
      selectedCategories.push(categoryId);
    } else {
      const index = selectedCategories.indexOf(categoryId);
      if (index > -1) {
        selectedCategories.splice(index, 1);
      }
    }
    this.userForm.patchValue({ categories: selectedCategories });
    this.userForm.get('categories')?.updateValueAndValidity();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.userForm.patchValue({ invoiceFile: file });
      this.userForm.get('invoiceFile')?.setErrors(null);
    } else {
      this.userForm.patchValue({ invoiceFile: null });
      this.userForm.get('invoiceFile')?.setErrors({ invalidFileType: true });
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
    return this.userForm.get('purchaseOrderNumber')?.invalid && this.userForm.get('purchaseOrderNumber')?.touched;
  }

  get notValidCategories() {
    return this.userForm.get('categories')?.invalid && this.userForm.get('categories')?.touched;
  }

}
