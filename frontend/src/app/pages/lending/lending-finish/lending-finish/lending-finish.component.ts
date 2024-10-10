import { Component } from '@angular/core';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Lending } from '../../../../core/models/lending.interface';
import Swal from 'sweetalert2';
import { LendingService } from './../../../../core/services/lending.service';
import { User,UserTeacher } from './../../../../core/models/user.interface';

@Component({
  selector: 'app-lending-finish',
  standalone: true,
  imports: [LendingOptionsComponent, CommonModule, FormsModule],
  templateUrl: './lending-finish.component.html',
  styleUrl: './lending-finish.component.css'
})


export class LendingFinishComponent {
  selectedLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: User[] = [];

  constructor(private lendingService: LendingService, private userService: UserService) {}

  ngOnInit() {
    this.getLending();
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
