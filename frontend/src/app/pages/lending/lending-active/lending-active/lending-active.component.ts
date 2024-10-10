import { User,UserTeacher } from './../../../../core/models/user.interface';
import { LendingService } from './../../../../core/services/lending.service';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { Lending } from '../../../../core/models/lending.interface';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';



@Component({
  selector: 'app-lending-active',
  standalone: true,
  imports: [LendingOptionsComponent, NgbAccordionModule, CommonModule, FormsModule],
  templateUrl: './lending-active.component.html',
  styleUrl: './lending-active.component.css',
  providers: [LendingService]
})
export class LendingActiveComponent {
  selectedLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: User[] = [];
  isEditMode: boolean = false;

  constructor(private lendingService: LendingService, private userService: UserService) {}

  ngOnInit() {
    this.getLending();

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

  selectTeacher(teacher: any) {
    this.selectedLending.teacherId = teacher.rut;
    this.selectedLending.teacherName = teacher.name;
  }

  public editLending() {
    const updatedLending: Lending = {
      id: this.selectedLending.id,
      date: this.selectedLending.date,
      state: this.selectedLending.state,
      comments: this.selectedLending.comments,
      borrowerId: this.selectedLending.borrowerId,
      borrowerName: this.selectedLending.borrowerName,
      teacherId: this.selectedLending.teacherId,
      teacherName: this.selectedLending.teacherName,
      lendingProducts: this.selectedLending.lendingProducts.map((product: { productId: any; name: any; stock: any; amount: any; }) => ({
        lendingId: this.selectedLending.id,
        productId: product.productId,
        name: product.name,
        stock: product.stock,
        amount: product.amount
      }))
    };

    console.log(updatedLending);

    this.lendingService.updateLending(updatedLending.id, updatedLending).subscribe(response => {
      console.log('Préstamo actualizado con éxito', response);
      this.disableEditMode();
    });
  }


  enableEditMode() {
    this.isEditMode = true;
  }

  disableEditMode() {
    this.isEditMode = false;
  }

  openLendingDetails(lending: any) {
    this.selectedLending = lending;
    this.getAllTeachers();
  }

  increaseAmount(index: number, stock: number): void {
    if (this.selectedLending.lendingProducts[index].amount < stock) {
      this.selectedLending.lendingProducts[index].amount++;
    }
  }

  decreaseAmount(index: number): void {
    if (this.selectedLending.lendingProducts[index].amount > 0) {
      this.selectedLending.lendingProducts[index].amount--;
    }
  }

  finishiLending(idLending: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
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
      const lendingToDelete = this.lending.find(lending => lending.id === idLending);

      if (lendingToDelete) {
        this.lending = this.lending.filter(lending => lending.id !== idLending);
      }
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Finalizado!",
          text: "El prestamo fue finalizado.",
          icon: "success"
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "El prestamo no fue finalizado",
          icon: "error"
        });
      }
    });
  }

  deleteLending(idLending: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Estas seguro?",
      text: "Estas a punto de eliminar un prestamo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, quiero eliminarlo!",
      cancelButtonText: "No, no quiero eliminarlo",
      reverseButtons: true
    }).then((result) => {
      const lendingToDelete = this.lending.find(lending => lending.id === idLending);

      if (lendingToDelete) {
        swalWithBootstrapButtons.fire({
          title: "Error!",
          text: "El prestamo no fue encontrado.",
          icon: "error"
        });
      }
      if (result.isConfirmed) {
        this.lending = this.lending.filter(lending => lending.id !== idLending);
        swalWithBootstrapButtons.fire({
          title: "Eliminado!",
          text: "El prestamo fue eliminado.",
          icon: "success"
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "El prestamo no fue eliminado",
          icon: "error"
        });
      }
    });
  }

}
