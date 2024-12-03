import { Component, Input, ChangeDetectorRef,SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.interface';
import { InvoiceService } from '../../../core/services/invoice.service';
import { EditedInvoice, Invoice, InvoiceCategory, NewInvoice } from '../../../core/models/invoice.interface';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invoices-edit.component.html',
  styleUrls: ['./invoices-edit.component.css']
})
export class InvoicesEditComponent implements OnInit{
  public categories: Category[] = [];
  @Input() invoiceId!: Invoice;
  public today = new Date();

  public formattedDate = this.today.toISOString().split('T')[0];

  public invoiceForm: FormGroup = new FormGroup({
      purchaseOrderNumber: new FormControl(['', Validators.required]),
      shipmentDate: new FormControl([this.formattedDate, Validators.required]),
      registrationDate: new FormControl([this.formattedDate, Validators.required]),
      invoiceFile: new FormControl([null, Validators.required]),
      categories: new FormControl([[], Validators.required]),

  })



  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceId'] && this.invoiceId) {
      this.patchFormValues(this.invoiceId);
    }
  }

  patchFormValues(invoiceId: Invoice) {
    console.log('12', invoiceId);
    this.invoiceForm.patchValue({
      id: invoiceId.id,
      purchaseOrderNumber: invoiceId.purchaseOrderNumber,
      shipmentDate: this.formatDate(invoiceId.shipmentDate),
      registrationDate: this.formatDate(invoiceId.registrationDate),
      categories: invoiceId.invoiceCategory.map((invoiceCategory: InvoiceCategory) => invoiceCategory.category.id),
    });

  }


  onSubmit(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const invoice: EditedInvoice = {
      purchaseOrderNumber: this.invoiceForm.value.purchaseOrderNumber,
      shipmentDate: this.invoiceForm.value.shipmentDate,
      registrationDate: this.invoiceForm.value.registrationDate,
      invoiceCategory: this.invoiceForm.value.categories,

      file: this.invoiceForm.value.invoiceFile
    };

    const file = this.invoiceForm.get('invoiceFile')?.value;



    this.invoiceService.updateInvoice(this.invoiceId.id ,invoice).subscribe({
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


  private loadInvoiceData(invoiceId: number): void {
    this.invoiceService.getInvoiceById(invoiceId).subscribe({
      next: (invoice: Invoice) => {
        const shipmentDate = this.formatDate(invoice.shipmentDate);
        const registrationDate = this.formatDate(invoice.registrationDate);

        const categoryIds = invoice.invoiceCategory.map((invoiceCategory: InvoiceCategory) => invoiceCategory.category.id);

        this.invoiceForm.patchValue({
          purchaseOrderNumber: invoice.purchaseOrderNumber,
          shipmentDate: shipmentDate,
          registrationDate: registrationDate,
          invoiceFile: null,
          categories: categoryIds,
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos de la factura.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
        console.error(error);
      },
    });
  }



  formatDate(date: Date): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // los meses comienzan desde 0
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
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
    const selectedCategories = this.invoiceForm.get('categories')?.value as number[];

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

  public invoiceForEdit(idInvoice: number): void {

    this.invoiceService.getInvoiceById(idInvoice).subscribe({
       next: (invoiceResult: Invoice) => {

        this.invoiceForm.patchValue({
          purchaseOrderNumber: invoiceResult.purchaseOrderNumber,
          shipmentDate: invoiceResult.shipmentDate,
          registrationDate: invoiceResult.registrationDate,
          invoiceCategory: this.invoiceForm.value.categories.map((categoryId: number) => ({
            invoice: null,
            category: { id: categoryId } as Category
          })),          invoiceFile: null,
          state: invoiceResult.state ?? false,
        });

      },

      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos de la factura.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
        console.error(error);
      },
    });

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
    return this.invoiceForm.get('purchaseOrderNumber')?.invalid && this.invoiceForm.get('purchaseOrderNumber')?.touched;
  }

  get notValidCategories() {
    return this.invoiceForm.get('categories')?.invalid && this.invoiceForm.get('categories')?.touched;
  }

}
