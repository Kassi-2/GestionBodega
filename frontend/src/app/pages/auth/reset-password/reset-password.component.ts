import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      checkConfirmPassword(),
    ]),
  });
  public token: string | null = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.verifyToken(this.token);
    this.verifyTokenBd();
  }

  public onResetPassword() {
    const { newPassword } = this.resetForm.value;
    const jwttoken = this.token ? this.token : '';
    this.authService.resetPassword(jwttoken, newPassword).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: '¡Restablecida!',
          text: response.message,
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 3000);
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error',
          text: `Ha ocurrido un error al restablecer la contrasña: ${error.error.message}`,
          icon: 'error',
          timer: 5000,
          showConfirmButton: false,
        });
      },
    });
  }

  private verifyToken(token: string | null) {
    if (token === null) {
      Swal.fire({
        title: 'Error',
        text: 'Enlace no válido',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        this.router.navigateByUrl('/auth/login');
      }, 2000);
    } else {
      if (this.authService.isTokenExpired(token)) {
        console.log('entre aca');
        Swal.fire({
          title: 'Error',
          text: 'Tiempo excedido, solicite otro enlace de cambio de contraseña',
          icon: 'error',
          timer: 5000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 5000);
      }
    }
  }

  public verifyTokenBd() {
    if (this.token === null) {
      Swal.fire({
        title: 'Error',
        text: 'Enlace no válido',
        icon: 'error',
        timer: 4000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        this.router.navigateByUrl('/auth/login');
      }, 4000);
    } else {
      this.authService.verifyCode(this.token).subscribe({
        next: (result) => {},
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
            timer: 4000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            this.router.navigateByUrl('/auth/login');
          }, 4000);
        },
      });
    }
  }
}

export function checkConfirmPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent;
    if (!formGroup) return null;

    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = control.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  };
}
