import { Component } from '@angular/core';
import { User, UserTeacher } from './../../../core/models/user.interface';
import { Lending, product } from './../../../core/models/lending.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingService } from '../../../core/services/lending.service';
import { UserService } from '../../../core/services/user.service';
import { TrashOptionsComponent } from '../trash-options/trash-options.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.interface';



@Component({
  selector: 'app-product-inactive',
  standalone: true,
  imports: [TrashOptionsComponent, CommonModule, FormsModule, NgbPagination],
  templateUrl: './product-inactive.component.html',
  styleUrl: './product-inactive.component.css'
})
export class ProductInactiveComponent {
  selectedLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: User[] = [];
  selectedDate: string = '';
  public allProducts!: Product[];
  public page = 1;
  public pageSize = 10;

  constructor(private lendingService: LendingService, private productService: ProductService) {}

  ngOnInit() {
    this.getProductsEliminated();
  }

  // Función para poder ver los prestamos eliminados filtrados por nombre
  filteredList(): product[] {
    const filteredLendings = this.allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }

  // Funcion para poder mostrar prestamos eliminados por fecha
  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = new Date(input.value);
    const date = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    this.lendingService.lendingForDate(date).subscribe((lending: Lending[]) => {
      this.lending = lending;
    });
  }

  // Funcion para poder mostrar todos los prestamos eliminados
  public getProductsEliminated(): void {
    this.productService.getProductsInactive().subscribe((products) => {
      this.allProducts = products;
    });
  }


  // Función para mostrar los detalles del prestamo
  openLendingDetails(id: number) {
    this.lendingService.getLendingForEdit(id).subscribe((lending: Lending[]) => {
      this.selectedLending = { ...lending };
    });
  }

}
