import { Component, OnDestroy, OnInit } from '@angular/core';
import { Assistant, User, UserAssitant } from '../../../core/models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserEditComponent } from "../user-edit/user-edit.component";

@Component({
  selector: 'app-user-assistant-list',
  standalone: true,
  imports: [UserOptionsComponent, AddUserComponent, UserEditComponent],
  templateUrl: './user-assistant-list.component.html',
  styleUrl: './user-assistant-list.component.css',
  providers: [UserService],
})
export class UserAssistantListComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.getAllAssistants();
  }
  ngOnDestroy(): void {}

  public user!: User;
  public assistants!: UserAssitant[];

  public deleteUser(id: number) {
    const confirmation = confirm('Estas seguro de eliminar al usuario?');
    if (confirmation) {
      this.userService.deleteUser(id).subscribe({
        next: (result) => {
          window.location.reload();
          alert(`Usuario ${result} eliminado`);
        },
        error: (error) => {
          alert(error.error.message);
        }
      });
    }
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
      });
  }
}
