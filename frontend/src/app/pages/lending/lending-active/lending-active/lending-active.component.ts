import { LendingService } from './../../../../core/services/lending.service';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { Lending } from '../../../../core/models/lending.interface';
import { FormsModule } from '@angular/forms';

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

  constructor(private lendingService: LendingService) {}

  ngOnInit() {
    this.getLending();
  }

  getLending(): void {
    this.lendingService.getLending().subscribe((lending: Lending[]) => {
      this.lending = lending
      console.log(this.lending)
    });
  }


  openLendingDetails(lending: any) {
    this.selectedLending = lending;
  }

  increaseAmount(index: number): void {
    this.selectedLending.lendingProducts[index].amount++;
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
