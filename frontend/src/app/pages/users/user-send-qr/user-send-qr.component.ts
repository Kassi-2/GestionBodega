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

/**
 * Función que envía al servicio la orden de mandar al backend la acción de enviar códigos qr a todos los usuarios registrados en la base de datos.
 *
 * @memberof UserSendQrComponent
 */
sendToEveryoneQr(){
    Swal.fire({
      title: 'Enviando los códigos QR...',
      text: 'Por favor espere un momento.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    Swal.showLoading();

    this.userService.sendToEveryoneQr().subscribe({
      next: () => {
        Swal.close();

        Swal.fire({
          title: 'Códigos QR enviados',
          text: `Código QR enviados a todos`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: () => {
        Swal.close();

        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al enviar los correos.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }
}
