import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, userToken } from '../../../core/models/user.interface';
import QRCode from 'qrcode'
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-qr.component.html',
  styleUrl: './user-qr.component.css'
})
export class UserQrComponent {
  @Input() user!: User;

  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef;
  isEmailValid: boolean = false;
  userMail = { mail: 'usuario@ejemplo.com' };

  private qrToken!: string;

  constructor(private userService: UserService){}

  ngAfterViewInit() {
    this.userService.getCode(this.user.rut).subscribe({
      next: (result:userToken) => {
        console.log('Resultado recibido del backend:', result);
        this.qrToken = result.token;  // Acceder al token en la respuesta

        this.generateQRCode(this.qrToken);  // Generar el código QR

        console.log('Código QR generado con token:', this.qrToken);
      },
      error: (error) => {
        console.error('Error al obtener el código QR:', error.error);
      }
    });
  }


  validateEmail(email: string): void {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(email);
  }

  async generateQRCode(data: string) {
    if (data) {
      const canvas = this.qrCanvas.nativeElement as HTMLCanvasElement;
      await QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'H' });
    } else {
      console.error('No se pudo generar el QR: No se proporcionó datos.');
    }
  }

  removeBlur() {
    document.querySelector('.table-responsive-sm')?.classList.remove('blur-background');
  }

  sendQr(email: string){
    console.log(email)
    this.userService.sendCodeByUser(this.qrToken, email).subscribe({
      next: (result) => {
        Swal.fire({
          title: 'Código QR enviado',
          text: `Código QR enviado al correo: ${email}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => {
          location.reload()
        }, 1500);
      },
    });
  }
}

