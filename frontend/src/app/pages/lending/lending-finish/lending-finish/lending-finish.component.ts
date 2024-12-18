import { Component } from '@angular/core';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Lending } from '../../../../core/models/lending.interface';
import Swal from 'sweetalert2';
import { LendingService } from './../../../../core/services/lending.service';
import { User,UserTeacher } from './../../../../core/models/user.interface';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lending-finish',
  standalone: true,
  imports: [LendingOptionsComponent, CommonModule, FormsModule, NgbPagination],
  templateUrl: './lending-finish.component.html',
  styleUrl: './lending-finish.component.css'
})


export class LendingFinishComponent {
  selectedLending: any;
  finishLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: User[] = [];
  selectedDate: string = '';
  inputValue: string = '';
  showList: boolean = false
  public page = 1;
  public pageSize = 10;
  public pageLending = 1;
  public pageSizeLending = 10;
  lendingForName: Lending[] = []


  constructor(private lendingService: LendingService, private userService: UserService) {}

  ngOnInit() {
    this.getLending();
  }

  // Función para poder ocultar los prestamos finalizados
  closeLendingList() {
    this.showList = false;
  }

  // Función para poder mandar la informacion del input a la funcion handleSubmit
  onEnterPress() {
    this.handleSubmit();
  }

  // Función para poder ver prestamos finalizados por una busqueda profunda
  handleSubmit() {
    if (this.inputValue.trim()) {
      this.lendingService.lendingForName(this.inputValue).subscribe((lending: Lending[]) => {
        this.lendingForName = lending;
      });
      this.inputValue = '';
    } else {
      console.log('Por favor, ingresa un valor.');
    }
  }

  // Función para poder ver los prestamos finalizados filtrados por nombre
  filteredList(): Lending[] {
    const filteredLendings = this.lending.filter(
      (lending) =>
        lending.borrower.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }

  // Funcion para poder mostrar prestamos finalizados por fecha
  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.getLending();
      return;
    }
    const selectedDate = new Date(input.value);
    const date = `${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()+1}`
    this.lendingService.lendingFinishForDate(date).subscribe((lendings: Lending[]) => {
      this.lending = lendings;
      console.log(lendings)
    });
  }

  // Funcion para poder mostrar todos los prestamos finalizados
  private getLending(): void {
    this.lendingService.getLendingFinish().subscribe((lending: Lending[]) => {
      this.lending = lending
      console.log(lending)
    });
  }

  // Función para poder mostrar todos los profesores
  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
    });
  }

  // Función para mostrar los detalles del prestamo
  openLendingDetails(id: number) {
    this.lendingService.getLendingForEdit(id).subscribe((lending: Lending) => {
      this.selectedLending = { ...lending };
      this.getAllTeachers();
    });
  }

  // Función para poder eliminar un prestamo finalizado
  public deleteLending(idLending: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger me-2"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "¿Estás seguro?",
      text: "¡Estás a punto de eliminar un préstamo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quiero eliminarlo",
      cancelButtonText: "No, no quiero eliminarlo",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.lendingService.deleteLending(idLending).subscribe(() => {
          this.lending = this.lending.filter(lending => lending.id !== idLending);
          swalWithBootstrapButtons.fire({
            title: "¡Eliminado!",
            text: "El préstamo fue eliminado.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            location.reload()
          }, 1500);
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "El préstamo no fue eliminado.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  solveProblem(lendingId: number){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });

    this.lendingService.updateLendingDisrepair(lendingId).subscribe({
      next:() => {
        swalWithBootstrapButtons.fire({
          title: '¡Préstamo actualizado!',
          text: 'Se marcó como resuelto del problema del préstamo.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          location.reload()
        }, 1500);
      },
      error: (error) => {
        swalWithBootstrapButtons.fire({
          title: 'Error',
          text: `El préstamo no se pudo actualizar, error: ${error.error.message}`,
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
        console.log(error)
      }

    }




    )
  }

}
