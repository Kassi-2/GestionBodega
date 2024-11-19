import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, userToken, UserType } from '../../../core/models/user.interface';
import QRCode from 'qrcode';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-qr.component.html',
  styleUrls: ['./user-qr.component.css']
})
export class UserQrComponent {
  @Input() user: User = { id: 0, rut: '', name: '', type: UserType.Student };

  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef;
  isEmailValid: boolean = false;
  userMail = { mail: 'usuario@ejemplo.com' };

  private qrToken!: string;

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.fetchAndGenerateQR();
    }
  }

  private fetchAndGenerateQR() {
    if (this.user && this.user.rut) {
      this.userService.getCode(this.user.rut).subscribe({
        next: (result: userToken) => {
          console.log('Resultado recibido del backend:', result);
          this.qrToken = result.token;

          this.generateQRCode(this.qrToken);

          console.log('Código QR generado con token:', this.qrToken);
        },
        error: (error) => {
          console.error('Error al obtener el código QR:', error.error);
        }
      });
    }
  }

  validateEmail(email: string): void {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(email);
  }

  async generateQRCode(data: string) {
    if (data) {
      const canvas = this.qrCanvas.nativeElement as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      await QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'H' });
    } else {
      console.error('No se pudo generar el QR: No se proporcionó datos.');
    }
  }

  removeBlur() {
    document.querySelector('.table-responsive-sm')?.classList.remove('blur-background');
  }

  sendQr(email: string) {
    Swal.fire({
      title: 'Enviando el código QR...',
      text: 'Por favor espera un momento.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    Swal.showLoading();

    this.userService.sendCodeByUser(this.qrToken, email).subscribe({
      next: () => {
        Swal.close();

        Swal.fire({
          title: 'Código QR enviado',
          text: `Código QR enviado al correo: ${email}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: () => {
        Swal.close();

        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al enviar el correo.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

}
