import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.interface';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.interface'; // Asegúrate de tener la interfaz Invoice
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-add',
  standalone: true,
  imports: [ReactiveFormsModule],  // Importación existente
  templateUrl: './invoice-add.component.html',
})
export class InvoiceAddComponent implements OnInit {
  userForm!: FormGroup;
  public categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      purchaseOrderNumber: ['', Validators.required],
      shipmentDate: ['', Validators.required],
      registrationDate: ['', Validators.required],
      invoiceFile: [null, Validators.required],
      categories: [[], Validators.required], // Validación para mínimo una categoría
    });

    this.getAllCategories();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
      return;
    }

    const invoice: Invoice = {
      id: 0,
      state: true,
      purchaseOrderNumber: this.userForm.value.purchaseOrderNumber,
      shipmentDate: this.userForm.value.shipmentDate,
      registrationDate: this.userForm.value.registrationDate,
      invoiceCategory: this.userForm.value.categories.map((categoryId: number) => ({
        invoice: {} as Invoice,
        category: { id: categoryId} as Category,
      })),
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
    this.userForm.get('categories')?.updateValueAndValidity(); // Actualiza la validez del campo
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.userForm.patchValue({ invoiceFile: file });
      this.userForm.get('invoiceFile')?.setErrors(null); // Limpiar errores si es válido
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

  // Métodos para comprobar la validez de campos individuales
  get notValidOrderNumber() {
    return this.userForm.get('purchaseOrderNumber')?.invalid && this.userForm.get('purchaseOrderNumber')?.touched;
  }

  get notValidCategories() {
    return this.userForm.get('categories')?.invalid && this.userForm.get('categories')?.touched;
  }
}
