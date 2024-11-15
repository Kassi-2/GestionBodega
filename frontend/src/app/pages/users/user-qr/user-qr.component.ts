import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.interface';
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

  private qrToken!: string;

  constructor(private userService: UserService){}

  ngAfterViewInit() {
    this.generateQRCode(this.qrToken);
  }

  ngOnInit(): void {
    this.userService.getCode(this.user).subscribe((token: string) => {
      this.qrToken = token;
    });
  }

  validateEmail(email: string): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(email);
  }

  async generateQRCode(data: string) {
     const canvas = this.qrCanvas.nativeElement as HTMLCanvasElement;
    await QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'H' });
  }

  removeBlur() {
    document.querySelector('.table-responsive-sm')?.classList.remove('blur-background');
  }

  sendQr(email: string){
    console.log(email)
    this.userService.sendCodeByUser(email).subscribe({
      next: (result) => {
        Swal.fire({
          title: 'Código QR Escaneado',
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

