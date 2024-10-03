import { SearchService } from './../../../core/services/search.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User, UserTeacher } from '../../../core/models/user.interface';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-teacher-list',
  standalone: true,
  imports: [UserOptionsComponent, UserEditComponent],
  templateUrl: './user-teacher-list.component.html',
  styleUrl: './user-teacher-list.component.css',
  providers: [UserService],
})
export class UserTeacherListComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getAllTeachers();
    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filteredTeacher = this.teachers.filter(
        (teachers) =>
          teachers.name.toLowerCase().includes(term.toLowerCase()) ||
          teachers.rut.includes(term)
      );
    });
  }
  ngOnDestroy(): void {}

  public user!: User;
  public teachers!: UserTeacher[];
  public filteredTeacher: UserTeacher[] = [];
  /**
   *Función que recibe el id de un usuario de tipo Profesor, dentro crea el aviso de confirmación de eliminación y envía al servicio el id del usuario a eliminar.
   *Envía un aviso si se realizó exitosamente o si tuvo un error.
   *
   * @param {number} id
   * @memberof UserTeacherListComponent
   */
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
        } else {
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

  /**
   *FUnción que recibe el id de un usuario Profesor y lo envía al servicio de Usuario para que lo actualice de la base de datos.
   *
   * @param {number} id
   * @memberof UserTeacherListComponent
   */
  public editUser(id: number) {
    this.userService.getUserById(id).subscribe((user: User) => {
      this.user = user;
    });
  }
  /**
   *Función que recibe del servicio todos los usuarios de tipo Profesor activos para luego guardarlos y listarlos.
   *
   * @private
   * @memberof UserTeacherListComponent
   */
  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
      this.filteredTeacher = teachers;
    });
  }
}
