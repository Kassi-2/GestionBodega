import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';

interface Lending {
  id: number;
  name: string;
  date: string;
  associated: boolean;
}

@Component({
  selector: 'app-lending-active',
  standalone: true,
  imports: [LendingOptionsComponent, NgbAccordionModule],
  templateUrl: './lending-active.component.html',
  styleUrl: './lending-active.component.css'
})
export class LendingActiveComponent {
  activeLendings: Lending[] = [];

  constructor() {}

  ngOnInit() {

    this.activeLendings = [
      { id: 1, name: 'Préstamo Personal', date: '2023-08-03' , associated: false},
      { id: 2, name: 'Préstamo para Negocio', date: '2023-04-10', associated: true },
      { id: 3, name: 'Préstamo Educativo', date: '2023-10-34', associated: true},
    ];

    this.activeLendings.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
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
        this.activeLendings = this.activeLendings.filter(lending => lending.id !== idLending);
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
      const lendingToDelete = this.activeLendings.find(lending => lending.id === idLending);

      if (lendingToDelete) {
        swalWithBootstrapButtons.fire({
          title: "Error!",
          text: "El prestamo no fue encontrado.",
          icon: "error"
        });
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
