import { User, UserTeacher } from './../../../core/models/user.interface';
import { Lending } from './../../../core/models/lending.interface';
import { Component } from '@angular/core';
import { LendingOptionsComponent } from '../lending-options/lending-options/lending-options.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LendingService } from '../../../core/services/lending.service';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'app-lending-inactive',
  standalone: true,
  imports: [LendingOptionsComponent, CommonModule, FormsModule, NgbPagination],
  templateUrl: './lending-inactive.component.html',
  styleUrl: './lending-inactive.component.css',
})
export class LendingInactiveComponent {
  selectedLending: any;
  searchTerm: string = '';
  lending: Lending[] = [];
  teachers: User[] = [];
  selectedDate: string = '';
  public page = 1;
  public pageSize = 10;

  constructor(private lendingService: LendingService, private userService: UserService) {}

  ngOnInit() {
    this.getLending();
  }

  filteredList(): Lending[] {
    const filteredLendings = this.lending.filter(
      (lending) =>
        lending.borrower.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredLendings;
  }

  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = new Date(input.value);
    const date = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    this.lendingService.lendingForDate(date).subscribe((lending: Lending[]) => {
      this.lending = lending;
    });
  }

  private getLending(): void {
    this.lendingService.getLendingInactive().subscribe((lending: Lending[]) => {
      this.lending = lending
    });
  }

  private getAllTeachers() {
    this.userService.getAllTeachers().subscribe((teachers: UserTeacher[]) => {
      this.teachers = teachers;
    });
  }

  openLendingDetails(id: number) {
    this.lendingService.getLendingForEdit(id).subscribe((lending: Lending[]) => {
      this.selectedLending = { ...lending };
      this.getAllTeachers();
    });
  }

}
