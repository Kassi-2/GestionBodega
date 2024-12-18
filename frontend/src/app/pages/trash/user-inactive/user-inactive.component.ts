import { Component } from '@angular/core';
import { User, UserTeacher } from './../../../core/models/user.interface';
import { Lending } from './../../../core/models/lending.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingService } from '../../../core/services/lending.service';
import { UserService } from '../../../core/services/user.service';
import { TrashOptionsComponent } from '../trash-options/trash-options.component';


@Component({
  selector: 'app-user-inactive',
  standalone: true,
  imports: [TrashOptionsComponent, CommonModule, FormsModule, NgbPagination],
  templateUrl: './user-inactive.component.html',
  styleUrl: './user-inactive.component.css'
})
export class UserInactiveComponent {
  selectedLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: User[] = [];
  user: User[] =[];
  selectedDate: string = '';
  public page = 1;
  public pageSize = 10;

  constructor(private lendingService: LendingService, private userService: UserService) {}

  ngOnInit() {
    this.getStudentsEliminated();
  }

  // Función para poder ver los prestamos eliminados filtrados por nombre
  filteredList(): User[] {
    const filteredLendings = this.user.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }


  // Funcion para poder mostrar todos los prestamos eliminados
  private getStudentsEliminated(): void {
    this.userService.getAllStudentsEliminated().subscribe((user: User[]) => {
      this.user = user
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

}
