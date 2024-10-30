import { AuthService } from './../../../core/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, AlertsComponent, NgbToastModule, RouterModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public show = true;

  constructor(private authService: AuthService, private router: Router) {}

  public logout(): void {
    const isLoggedOut = this.authService.logout();

    if (isLoggedOut) {
      Swal.fire({
        title: '¡Sesión cerrada!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      this.router.navigate(['auth/login']);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cerrar la sesión',
        icon: 'error',
      });
    }
  }


}
