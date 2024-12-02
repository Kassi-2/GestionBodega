import { Component, inject, OnInit } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { InvoiceListComponent } from '../invoice-list/invoice-list.component';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../core/services/invoice.service';
import { FilterInvoices, Invoice } from '../../../core/models/invoice.interface';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.interface';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDatepickerModule,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { CustomDatepickerI18n } from '../../../core/services/custom-datepicker-i18n.service';
import { CustomDateParserFormatter } from '../../../core/services/custom-date-parser-formatter.service';

@Component({
  selector: 'app-invoice-options',
  standalone: true,
  imports: [InvoiceListComponent, FormsModule, NgbDatepickerModule, JsonPipe],
  templateUrl: './invoice-options.component.html',
  styleUrl: './invoice-options.component.css',
  providers: [ 
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
})
export class InvoiceOptionsComponent implements OnInit {
  public searchTerm: string = '';
  public allInvoices: Invoice[] = [];
  public invoices: Invoice[] = [];
  public categories: Category[] = [];
  model!: NgbDateStruct;
  date!: { year: number; month: number };
  public startDate!: string;
  public endDate!: string;
  public selectedCategories: number[] = [];

  constructor(

    private invoiceService: InvoiceService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.getAllInvoices();
    this.getAllCategories();
  }


  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  public getAllInvoices() {
    this.invoiceService.getAllInvoices().subscribe({
      next: (invoices: Invoice[]) => {
        this.allInvoices = invoices;
        this.invoices = invoices;
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  private getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (result: Category[]) => {
        this.categories = result;
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  filteredList(): Invoice[] {
    const filteredInvoices = this.invoices.filter(
      (invoice: Invoice) =>
        invoice.purchaseOrderNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredInvoices;
  }

  toggleCategory(category: number) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter((c) => c !== category);
    } else {
      this.selectedCategories.push(category);
    }
  }

  filterInvoices() {

    const startDateFormatted = this.fromDate
    ? `${this.fromDate.year}-${this.pad(this.fromDate.month)}-${this.pad(this.fromDate.day)}`
    : undefined;

  const endDateFormatted = this.toDate
    ? `${this.toDate.year}-${this.pad(this.toDate.month)}-${this.pad(this.toDate.day)}`
    : undefined;

  const filters: FilterInvoices = {
    startDate: startDateFormatted,
    endDate: endDateFormatted,
    categories: this.selectedCategories.length ? this.selectedCategories : undefined,
  };


    this.invoiceService.filterInvoices(filters).subscribe({
      next: (invoices: Invoice[]) => {
        this.invoices = invoices;
      },
      error: (error) => {
        alert(error.error.message)
      }
    });
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  public cleanFilters() {
    this.invoices = this.allInvoices;
    this.startDate = '';
    this.endDate = '';
    this.selectedCategories = [];
  }
}
