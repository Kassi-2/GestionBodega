import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserEdit, UserRegister } from '../../../core/models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { Degree } from '../../../core/models/degree.interface';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
  providers: [UserService],
})
export class AddUserComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllDegrees();
  }
  ngOnDestroy(): void {}

  public degrees!: Degree[];
  public userForm: FormGroup = new FormGroup({
    rut: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d{7,8}-[\\dkK]$'),
      checkRunValidator(),
    ]),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    mail: new FormControl('', Validators.email),
    phoneNumber: new FormControl(),
    degree: new FormControl(),
    role: new FormControl(),
  });

  public register() {
    const user: UserRegister = {
      rut: this.userForm.get('rut')?.value,
      name: this.userForm.get('name')?.value,
      type: this.userForm.get('type')?.value,
      mail: this.userForm.get('mail')?.value,
      phoneNumber: Number(this.userForm.get('phoneNumber')?.value),
      degree: this.userForm.get('degree')?.value,
      role: this.userForm.get('role')?.value,
    };

    this.userService.register(user).subscribe({
      next: () => {
        window.location.reload();
        this.clearForm();
      },
      error: (error) => {
        alert(error.error.message);
      },
    });
  }

  private getAllDegrees() {
    this.userService.getAllDegrees().subscribe((degrees: Degree[]) => {
      this.degrees = degrees;
    });
  }

  public clearForm() {
    this.userForm.reset({
      rut: '',
      name: '',
      type: '',
      mail: '',
      phoneNumber: '',
      degree: '',
      role: '',
    });
  }

  public getDegree(code: string) {
    const degree = this.degrees.find((d) => d.code == code);
    return degree?.name;
  }

  public ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}

export function checkRunValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = checkRun(control.value);
    return isValid ? null : { invalidRun: true };
  };
}

function checkRun(run: string): boolean {
  run = run.replace('-', '');

  const cdEntered = run.slice(-1).toUpperCase();
  const number = run.slice(0, -1);

  let add = 0;
  let factor = 2;
  for (let i = number.length - 1; i >= 0; i--) {
    add += parseInt(number.charAt(i)) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const cdExpected = 11 - (add % 11);
  const cdCalculated =
    cdExpected === 11 ? '0' : cdExpected === 10 ? 'K' : cdExpected.toString();

  return cdEntered === cdCalculated;
}
