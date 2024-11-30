import { Component, inject, OnInit } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { InvoiceListComponent } from '../invoice-list/invoice-list.component';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.interface';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.interface';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-options',
  standalone: true,
  imports: [InvoiceListComponent, FormsModule, NgbDatepickerModule, JsonPipe],
  templateUrl: './invoice-options.component.html',
  styleUrl: './invoice-options.component.css',
})
export class InvoiceOptionsComponent implements OnInit {
  public searchTerm: string = '';
  public invoices: Invoice[] = [];
  public categories: Category[] = [];
  model!: NgbDateStruct;
  date!: { year: number; month: number };

  constructor(
    private searchService: SearchService,
    private invoiceService: InvoiceService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.getAllInvoices();
    this.getAllCategories();
  }

  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(
    this.calendar.getToday(),
    'd',
    10
  );

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
        this.invoices = invoices;
        console.log(invoices);
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
}
