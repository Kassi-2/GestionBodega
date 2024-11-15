import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-send-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-send-qr.component.html',
  styleUrl: './user-send-qr.component.css'
})
export class UserSendQrComponent {

  constructor(private userService: UserService){}

  sendToEveryoneQr(){
    this.userService.sendToEveryoneQr().subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Códigos QR enviados',
          text: `Los códigos QR fueron enviados exitosamente a todos los usuarios.`,
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
