import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserService } from '../../../core/services/user.service';
import { User, UserStudent } from '../../../core/models/user.interface';
import { Degree } from '../../../core/models/degree.interface';
import { Subscription } from 'rxjs';
import { UserEditComponent } from "../user-edit/user-edit.component";
import { SearchService } from '../../../core/services/search.service';

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
