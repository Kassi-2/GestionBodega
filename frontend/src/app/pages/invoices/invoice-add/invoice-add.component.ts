import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-invoice-add',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDatepickerModule, FormsModule],
  templateUrl: './invoice-add.component.html',
  styleUrl: './invoice-add.component.css'
})
export class InvoiceAddComponent {
  today = inject(NgbCalendar).getToday();

	model!: NgbDateStruct ;
	date!: { year: number; month: number; };
  public userForm!: FormGroup;

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(null),

    });
  }

  get notValidDescription() {
    return (
      this.userForm.get('description')?.invalid && this.userForm.get('description')?.touched
    );
  }

  closeModal() {
    this.userForm.reset();
  }


  onSubmit(): any {

  }

}
