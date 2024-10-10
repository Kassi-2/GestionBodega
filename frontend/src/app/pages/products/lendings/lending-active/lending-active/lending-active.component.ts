import { lendingProducts, Lending } from './../../../../../core/models/lending.interface';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { LendingService } from '../../../../../core/services/lending.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-lending-active',
  standalone: true,
  imports: [LendingOptionsComponent, NgbAccordionModule, CommonModule, BrowserModule, FormsModule],
  templateUrl: './lending-active.component.html',
  styleUrl: './lending-active.component.css'
})
export class LendingActiveComponent {
  activeLendings: Lending[] = [];
  selectedLending: any;
  searchTerm: string = '';


  constructor(private lendingService: LendingService) {}

  ngOnInit() {

    // this.activeLendings = this.lendingService.getActiveLendings();

  }

  get filteredLendings(): Lending[] {
    return this.activeLendings.filter(lending =>
      lending.state.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  openLendingDetails(lending: any) {
    this.selectedLending = lending;
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
      const lendingToDelete = this.activeLendings.find(lending => lending.id === idLending);

      if (lendingToDelete) {
      }
      if (result.isConfirmed) {
        this.activeLendings = this.activeLendings.filter(lending => lending.id !== idLending);
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
      const lendingToDelete = this.activeLendings.find(lending => lending.id === idLending);

      if (lendingToDelete) {
      }
      if (result.isConfirmed) {
        this.activeLendings = this.activeLendings.filter(lending => lending.id !== idLending);
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
