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


  constructor(private lendingService: LendingService, private userService: UserService) {}

  ngOnInit() {
    this.getLending();
  }

  closeLendingList() {
    this.showList = false;
  }

  onEnterPress() {
    this.handleSubmit();
  }

  handleSubmit() {
    if (this.inputValue.trim()) {
      console.log('Texto enviado:', this.inputValue);
      this.lendingService.getFilteredLendings(this.inputValue).subscribe(
        (lending: Lending[]) => {
          this.lending = lending;
          this.showList = true;
        },
        (error) => {
          console.error('Error al obtener los préstamos filtrados:', error);
        }
      );
      this.inputValue = '';
    } else {
      console.log('Por favor, ingresa un valor.');
    }
  }


  filteredList(): Lending[] {
    const filteredLendings = this.lending.filter(
      (lending) =>
        lending.borrowerName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }

  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    console.log(this.selectedDate)
  }

  private getLending(): void {
    this.lendingService.getLending().subscribe((lending: Lending[]) => {
      this.lending = lending
    });
  }

  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
    });
  }

  public openLendingDetails(lending: any) {
    this.selectedLending = lending;
    this.getAllTeachers();
  }

  public deleteLending(idLending: number): void {
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
      if (result.isConfirmed) {
        this.lendingService.deleteLending(idLending).subscribe(() => {
          this.lending = this.lending.filter(lending => lending.id !== idLending);
          swalWithBootstrapButtons.fire({
            title: "Eliminado!",
            text: "El prestamo fue eliminado.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "El prestamo no fue eliminado",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

}
