import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { Degree } from '../../../core/models/degree.interface';
import { User, UserEdit } from '../../../core/models/user.interface';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';


declare var bootstrap: any;

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule, FormsModule, HttpClientModule, NgbPopoverModule, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
  providers: [UserService],
})
export class UserEditComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllDegrees();
  }
  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.patchFormValues(this.user);
      this.cdr.detectChanges();
    }
  }

  @Input() user!: User;
  public degrees!: Degree[];
  public userForm: FormGroup = new FormGroup({
    rut: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d{7,8}-[\\dkK]$'),
      checkRunValidator(),
    ]),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.email]),
    phoneNumber: new FormControl(),
    degree: new FormControl(),
    role: new FormControl(),
  });

  get notValidRut() {
    return (
      this.userForm.get('rut')?.invalid && this.userForm.get('rut')?.touched
    );
  }

  get notValidName() {
    return (
      this.userForm.get('name')?.invalid && this.userForm.get('name')?.touched
    );
  }

  get notValidType() {
    return (
      this.userForm.get('type')?.invalid && this.userForm.get('type')?.touched
    );
  }

  get notValidMail() {
    return (
      this.userForm.get('mail')?.invalid && this.userForm.get('mail')?.touched
    );
  }

  get notValidPhoneNumber() {
    return (
      this.userForm.get('phoneNumber')?.invalid && this.userForm.get('phoneNumber')?.touched
    );
  }

  get notValidDegree() {
    return (
      this.userForm.get('degree')?.invalid && this.userForm.get('degree')?.touched
    );
  }

  get notValidRole() {
    return (
      this.userForm.get('role')?.invalid && this.userForm.get('role')?.touched
    );
  }

  public edit() {
    const user: UserEdit = {
      rut: this.userForm.get('rut')?.value,
      name: this.userForm.get('name')?.value,
      type: this.userForm.get('type')?.value,
      mail: this.userForm.get('mail')?.value,
      phoneNumber: Number(this.userForm.get('phoneNumber')?.value),
      degree: this.userForm.get('degree')?.value,
      role: this.userForm.get('role')?.value,
    };

    this.userService.updateUser(this.user.id,user).subscribe({
      next: () => {
        window.location.reload();
        this.clearForm();
      },
      error: (error) => {
        alert(error.error.message);
        window.location.reload();
      },
    });
  }


  private getAllDegrees() {
    this.userService.getAllDegrees().subscribe((degrees: Degree[]) => {
      this.degrees = degrees;
    });
  }

  private patchFormValues(user: User): void {
    this.userForm.patchValue({
      rut: user.rut,
      name: user.name,
      type: user.type,
      mail: user.mail,
      phoneNumber: user.phoneNumber && user.phoneNumber !== 0 ? user.phoneNumber : '',
      degree: user.student?.codeDegree,
      role: user.assistant?.role,
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

