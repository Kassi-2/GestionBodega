import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserService } from '../../../core/services/user.service';
import { User, UserStudent } from '../../../core/models/user.interface';
import { Degree } from '../../../core/models/degree.interface';
import { Subscription } from 'rxjs';
import { UserEditComponent } from "../user-edit/user-edit.component";
import { SearchService } from '../../../core/services/search.service';
import { Student } from './../../../core/models/user.interface';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-user-student-list',
  standalone: true,
  imports: [UserOptionsComponent, AddUserComponent, UserEditComponent],
  templateUrl: './user-student-list.component.html',
  styleUrl: './user-student-list.component.css',
  providers: [UserService, SearchService],
})
export class UserStudentListComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService, private searchService: SearchService) {}

  ngOnInit(): void {
    this.subscriptions.add(this.getAllStudents());
    this.subscriptions.add(this.getAllDegrees());

    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filteredStudents = this.students.filter((student) =>
        student.name.toLowerCase().includes(term.toLowerCase()) ||
        student.rut.includes(term)
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  public selectedUserId!: number;
  public user!: User;
  private subscriptions: Subscription = new Subscription();
  public students!: UserStudent[];
  public degrees!: Degree[];
  public filteredStudents: UserStudent[] = [];

  public deleteUser(id: number) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro?',
        text: `¡Estás a punto de eliminar este usuario!`,
        iconHtml: `
          <div style="
            border-radius: 50%;
            width: 4rem;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>`,
        showCancelButton: true,
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.userService.deleteUser(id).subscribe({
            next: (response) => {
              swalWithBootstrapButtons.fire({
                title: '¡Eliminado!',
                text: 'El usuario ha sido eliminado exitosamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            },
          });
          }
          else{
              swalWithBootstrapButtons.fire({
                title: 'Cancelado',
                text: 'El usuario no se ha eliminado.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
              });
            }
          });


        }



  public getDegree(code: string) {
    const degree = this.degrees.find((d) => d.code == code);
    return degree?.name;
  }

  private getAllStudents() {
    this.userService.getAllStudents().subscribe((students: UserStudent[]) => {
      this.students = students;
      this.filteredStudents = students;
    });
  }


  private getAllDegrees() {
    this.userService.getAllDegrees().subscribe((degrees: Degree[]) => {
      this.degrees = degrees;
    });
  }

  public editUser(id: number) {
    this.userService.getUserById(id).subscribe((user: User) => {
      this.user = user;
    });
  }
}
