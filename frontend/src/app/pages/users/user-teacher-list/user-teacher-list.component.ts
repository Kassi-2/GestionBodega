import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserTeacher } from '../../../core/models/user.interface';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user-teacher-list',
  standalone: true,
  imports: [UserOptionsComponent, AddUserComponent],
  templateUrl: './user-teacher-list.component.html',
  styleUrl: './user-teacher-list.component.css',
  providers: [UserService],
})
export class UserTeacherListComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllTeachers();
  }
  ngOnDestroy(): void {}

  public teachers!: UserTeacher[];

  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
    });
  }
}
