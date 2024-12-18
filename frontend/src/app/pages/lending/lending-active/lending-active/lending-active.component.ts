import { SearchService } from './../../../../core/services/search.service';
import { UserTeacher } from './../../../../core/models/user.interface';
import { LendingService } from './../../../../core/services/lending.service';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule, NgbPagination, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { Lending } from '../../../../core/models/lending.interface';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';



@Component({
  selector: 'app-lending-active',
  standalone: true,
  imports: [LendingOptionsComponent, NgbAccordionModule, CommonModule, FormsModule, NgbPagination, NgbPopover],
  templateUrl: './lending-active.component.html',
  styleUrl: './lending-active.component.css',
  providers: [LendingService]
})
export class LendingActiveComponent {
  selectedLending: any;
  resetLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  public filteredLendings: Lending[] = [];
  teachers: UserTeacher[] = [];
  isEditMode: boolean = false;
  selectedDate: string = '';
  public page = 1;
  public pageSize = 10;
  auxiliaryComments: any;
  hasProblemsLending: boolean = false;



  constructor(private lendingService: LendingService, private userService: UserService, private searchService: SearchService) {}

  ngOnInit() {
    this.getLending();

    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filteredLendings = this.lending.filter(
        (lending) =>
          lending.borrower.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  // Funcion para poder mostrar prestamos activos por fecha
  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.getLending();
      return;
    }
    const selectedDate = new Date(input.value);
    const date = `${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()+1}`
    this.lendingService.lendingActiveForDate(date).subscribe((lendings: Lending[]) => {
      this.filteredLendings = lendings;
      console.log(lendings)
    });
  }

  openDatePicker(datePicker: HTMLInputElement) {
    datePicker.showPicker();
  }


  // Funcion para poder mostrar todos los prestamos activos
  getLending(): void {
    this.lendingService.getLending().subscribe((lending: Lending[]) => {
      this.lending = lending;
      this.filteredLendings = lending;
    });
  }

  // Función para poder mostrar todos los profesores
  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
    });
  }

  // Función para poder ver los prestamos activos filtrados por nombre
  filteredList(): Lending[] {
    const filteredLendings = this.lending.filter(
      (lending) =>
        lending.borrower.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }

  // Función para obtener el profesor asignado a un prestamos
  selectTeacher(teacher: any) {
    this.selectedLending.teacherId = teacher.rut;
    this.selectedLending.teacherName = teacher.name;
  }

  // Función para mostrar los detalles del prestamos
  openLendingDetails(id: number): void {
    this.lendingService.getLendingForEdit(id).subscribe((lending: Lending) => {
      this.resetLending = lending;
      this.selectedLending = { ...lending }; // Crea una copia del préstamo
      this.auxiliaryComments = this.selectedLending.comments; // Inicializa con el valor actual
      this.getAllTeachers();
    });
  }


  closeModal(): void {
    this.auxiliaryComments = this.selectedLending.comments; // Restaura el valor inicial
  }



  // Función para poder finalizar un prestamo activo
  finishLending(idLending: number, comments: string, hasProblems: boolean): void {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger me-2"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "¿Estás seguro?",
      text: "¡Estás a punto de finalizar un préstamo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "No, no estoy seguro",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedLending.comments = this.auxiliaryComments;
        this.lendingService.lendingFinish(idLending, comments).subscribe(() => {
          this.lending = this.lending.filter(lending => lending.id !== idLending);
          if (hasProblems){
            this.lendingService.markAsProblematic(idLending).subscribe()

          }
        swalWithBootstrapButtons.fire({
          title: "¡Finalizado!",
          text: "El préstamo fue finalizado con éxito.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        this.getLending()
      });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "El préstamo no fue finalizado.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

}
