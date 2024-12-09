import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './request-reset-password.component.html',
  styleUrl: './request-reset-password.component.css'
})
export class RequestResetPasswordComponent {
  constructor(private authService: AuthService) {}

  public isRequestSent = false;

  public resetRequestForm: FormGroup = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
  });

  public onRequestPasswordReset() {
    if (this.resetRequestForm.invalid) {
      return;
    }

    const { mail } = this.resetRequestForm.value;
    this.authService.requestPasswordReset(mail).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: '¡Enviado!',
          text: response.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this.isRequestSent = true; 
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error',
            text: error.error.message,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
        });
      },
    });
  }
}
