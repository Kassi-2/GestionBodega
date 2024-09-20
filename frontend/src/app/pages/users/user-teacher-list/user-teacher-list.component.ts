import { SearchService } from './../../../core/services/search.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User, UserTeacher } from '../../../core/models/user.interface';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserEditComponent } from "../user-edit/user-edit.component";

@Component({
  selector: 'app-user-teacher-list',
  standalone: true,
  imports: [UserOptionsComponent, AddUserComponent, UserEditComponent],
  templateUrl: './user-teacher-list.component.html',
  styleUrl: './user-teacher-list.component.css',
  providers: [UserService],
})
export class UserTeacherListComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService, private searchService: SearchService) {}

  ngOnInit(): void {
    this.getAllTeachers();
    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filteredTeacher = this.teachers.filter((teachers) =>
        teachers.name.toLowerCase().includes(term.toLowerCase()) ||
        teachers.rut.includes(term)
      );
    });
  }
  ngOnDestroy(): void {}

  public user!: User;
  public teachers!: UserTeacher[];
  public filteredTeacher: UserTeacher[] = [];

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

  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
      this.filteredTeacher = teachers;
    });
  }
}
