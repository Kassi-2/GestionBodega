import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../core/models/user.interface';
import { Lending } from '../../../core/models/lending.interface';
import { LendingService } from '../../../core/services/lending.service';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.interface';

@Component({
  selector: 'app-history-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination], // Ya no es necesario LendingOptionsComponent
  templateUrl: './history-products.component.html',
  styleUrls: ['./history-products.component.css'],
})
export class HistoryProductsComponent {
  selectedLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: User[] = [];
  selectedDate: string = '';
  public filteredLending: Lending[] = [];
  public page = 1;
  public pageSize = 10;
  public product!: Product;
  public productId!: number;
  private url!: any;

  constructor(
    private route: ActivatedRoute,
    private lendingService: LendingService,
    private userService: UserService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? +id : 0;
    this.getProduct();
    this.getHistory();
    this.route.queryParams.subscribe((params) => {
      this.url = params; // { id: 1, name: 'test' }
    });
  }

  filteredList(): Lending[] {
    const filteredLendings = this.lending.filter((lending) =>
      lending.borrower.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }

  private getHistory(): void {
    this.lendingService
      .getHistoryProducts(this.productId)
      .subscribe((lending: Lending[]) => {
        this.lending = lending;
        console.log(lending);
      });
  }

  private getAllTeachers(): void {
    this.userService.getAllTeachers().subscribe((teachers: User[]) => {
      this.teachers = teachers;
    });
  }

  openLendingDetails(id: number): void {
    this.lendingService.getLendingForEdit(id).subscribe((lending: Lending) => {
      this.selectedLending = lending;
      this.getAllTeachers();
    });
  }

  public getProduct() {
    this.productService.getProductForEdit(this.productId).subscribe({
      next: (result: Product) => {
        this.product = result;
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  public navigate() {
    this.router.navigate([this.url.url]);
  }
}
