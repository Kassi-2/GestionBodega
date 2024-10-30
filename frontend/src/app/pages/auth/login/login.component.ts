import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService],
})
export class LoginComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

  constructor(private authService: AuthService, private router: Router) {}

  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
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


  public login() {


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
      error: (error) =>{
        swalWithBootstrapButtons.fire({
          title: 'Error',
          text: 'El usuario o la contraseña son incorrectos',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
        console.log(error.message);
      },
    });
  }
}
