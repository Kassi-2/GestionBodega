import { UserTeacher } from './../../../../core/models/user.interface';
import { LendingService } from './../../../../core/services/lending.service';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { Lending } from '../../../../core/models/lending.interface';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';



@Component({
  selector: 'app-lending-active',
  standalone: true,
  imports: [LendingOptionsComponent, NgbAccordionModule, CommonModule, FormsModule, NgbPagination],
  templateUrl: './lending-active.component.html',
  styleUrl: './lending-active.component.css',
  providers: [LendingService]
})
export class LendingActiveComponent {
  selectedLending: any;
  resetLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: UserTeacher[] = [];
  isEditMode: boolean = false;
  selectedDate: string = '';
  public page = 1;
  public pageSize = 10;



  constructor(private lendingService: LendingService, private userService: UserService) {}

  ngOnInit() {
    this.getLending();

  }

  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
  }

  getLending(): void {
    this.lendingService.getLending().subscribe((lending: Lending[]) => {
      this.lending = lending
      console.log(this.lending)
    });
  }

  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
      console.log(teachers)
    });
  }

  filteredList(): Lending[] {
    const filteredLendings = this.lending.filter(
      (lending) =>
        lending.borrowerName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }

  selectTeacher(teacher: any) {
    this.selectedLending.teacherId = teacher.rut;
    this.selectedLending.teacherName = teacher.name;
  }

  public editLending(): void {
    if (!this.selectedLending) return;

    const updatedLending: Lending = {
      ...this.selectedLending,
      lendingProducts: this.selectedLending.lendingProducts.map((product: any) => ({
        lendingId: this.selectedLending.id,
        ...product
      }))
    };

    console.log(updatedLending);

    this.lendingService.updateLending(updatedLending.id, updatedLending).subscribe({
      next: (response) => {
        console.log('Préstamo actualizado con éxito', response);
        this.disableEditMode();
        this.resetLending = null;
      },
      error: (err) => {
        console.error('Error al actualizar el préstamo', err);
      }
    });
  }


  enableEditMode() {
    this.isEditMode = true;
  }

  disableEditMode() {
    this.isEditMode = false;
  }

  resetChanges() {
    this.selectedLending = this.resetLending;
  }

  openLendingDetails(lending: any) {
    this.resetLending = lending;
    this.selectedLending = lending;
    this.getAllTeachers();
  }

  increaseAmount(index: number, stock: number) {
    const product = this.selectedLending.lendingProducts[index];
    if (product.amount < stock + product.amount) {
      product.amount++;
      product.stock--;
    }
  }

  decreaseAmount(index: number) {
    const product = this.selectedLending.lendingProducts[index];
    if (product.amount > 0) {
      product.amount--;
      product.stock++;
    }
  }

  finishLending(idLending: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger me-2"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Estas seguro?",
      text: "Estas a punto de finalizar un prestamo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, estoy seguro!",
      cancelButtonText: "No, no estoy seguro",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.lending = this.lending.filter(lending => lending.id !== idLending);
        swalWithBootstrapButtons.fire({
          title: "Finalizado!",
          text: "El prestamo fue finalizado.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "El prestamo no fue finalizado",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

}
