import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserService } from '../../../core/services/user.service';
import { UserStudent } from '../../../core/models/user.interface';
import { Degree } from '../../../core/models/degree.interface';

@Component({
  selector: 'app-user-student-list',
  standalone: true,
  imports: [UserOptionsComponent, AddUserComponent],
  templateUrl: './user-student-list.component.html',
  styleUrl: './user-student-list.component.css',
  providers: [UserService],
})
export class UserStudentListComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllStudents();
    this.getAllDegrees();
  }
  ngOnDestroy(): void {}

  public students!: UserStudent[];
  public degrees!: Degree[];

  public getDegree(code: string) {
    const degree = this.degrees.find((d) => d.code == code);
    return degree?.name;
  }

  private getAllStudents() {
    this.userService.getAllStudents().subscribe((students: UserStudent[]) => {
      this.students = students;
      console.log(this.students);
    });
  }

  private getAllDegrees() {
    this.userService.getAllDegrees().subscribe((degrees: Degree[]) => {
      this.degrees = degrees;
    });
  }
}
