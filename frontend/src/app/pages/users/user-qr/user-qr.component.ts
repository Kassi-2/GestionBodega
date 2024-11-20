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
/**
 * Función que verifica el usuario seleccionado por el otro componente para generar el código Qr.
 *
 * @private
 * @memberof UserQrComponent
 */
private fetchAndGenerateQR() {
    if (this.user && this.user.rut) {
      this.userService.getCode(this.user.rut).subscribe({
        next: (result: userToken) => {
          this.qrToken = result.token;
          this.generateQRCode(this.qrToken);
        },
        error: (error) => {
          console.log('Error al obtener el código QR:', error.error);
        }
      });
    }
  }
/**
 * Fución para validar el email ingresado por el usuario en un input.
 *
 * @param {string} email
 * @memberof UserQrComponent
 */
validateEmail(email: string): void {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(email);
  }
/**
 * Función que genera el código qr según el token seleccionado mediante un canva.
 *
 * @param {string} data
 * @memberof UserQrComponent
 */
async generateQRCode(data: string) {
    if (data) {
      const canvas = this.qrCanvas.nativeElement as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      await QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'H' });
    } else {
      console.log('No se pudo generar el QR: No se proporcionó datos.');
    }
  }
/**
 * Función que quita la difuminación de la tabla de información de los usuarios.
 *
 * @memberof UserQrComponent
 */
removeBlur() {
    document.querySelector('.table-responsive-sm')?.classList.remove('blur-background');
  }
/**
 * Fución que envía al backend el token y el email ingresado por el usuario o el registrado, para que éste haga el envío del correo.
 *
 * @param {string} email
 * @memberof UserQrComponent
 */
sendQr(email: string) {
    Swal.fire({
      title: 'Enviando el código QR...',
      text: 'Por favor espere un momento.',
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
