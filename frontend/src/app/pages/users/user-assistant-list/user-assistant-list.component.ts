import { SearchService } from './../../../core/services/search.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Assistant, User, UserAssitant } from '../../../core/models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserEditComponent } from "../user-edit/user-edit.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-assistant-list',
  standalone: true,
  imports: [UserOptionsComponent, AddUserComponent, UserEditComponent],
  templateUrl: './user-assistant-list.component.html',
  styleUrl: './user-assistant-list.component.css',
  providers: [UserService],
})
export class UserAssistantListComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService, private searchService: SearchService) {}
  ngOnInit(): void {
    this.getAllAssistants();
    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filteredAssitant = this.assistants.filter((assistant) =>
        assistant.name.toLowerCase().includes(term.toLowerCase()) ||
        assistant.rut.includes(term)
      );
    });
  }
  ngOnDestroy(): void {}

  public user!: User;
  public assistants!: UserAssitant[];
  public filteredAssitant: UserAssitant[] = [];


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

  public editUser(id: number) {
    this.userService.getUserById(id).subscribe((user: User) => {
      this.user = user;
    });
  }

  public getAllAssistants() {
    this.userService
      .getALLAssistants()
      .subscribe((assistants: UserAssitant[]) => {
        this.assistants = assistants;
        this.filteredAssitant = assistants;
      });
  }
}
