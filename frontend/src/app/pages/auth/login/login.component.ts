import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('passwordInput')
  passwordInput!: ElementRef;  // Referencia al campo de contraseña

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get notValidUsername() {
    return (
      this.loginForm.get('username')?.invalid && this.loginForm.get('username')?.touched
    );
  }

  get notValidPassword() {
    return (
      this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched
    );
  }

  // Maneja el evento Enter en el campo de usuario
  public onUserEnter(): void {
    // Enfocar el campo de contraseña
    this.passwordInput.nativeElement.focus();
  }

  // Maneja el evento Enter en el campo de contraseña
  public onPasswordEnter(): void {
    this.login();
  }

  // Función de inicio de sesión (se ejecuta al enviar el formulario)
  public login(): void {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger me-2"
      },
      buttonsStyling: false
    });

    this.authService.login(this.loginForm.value).subscribe({
      next: (result) => {
        swalWithBootstrapButtons.fire({
          title: '¡Sesión iniciada!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigateByUrl('lendings/active');
      },
      error: (error) => {
        swalWithBootstrapButtons.fire({
          title: 'Error',
          text: 'El usuario o la contraseña son incorrectos',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  }
}
