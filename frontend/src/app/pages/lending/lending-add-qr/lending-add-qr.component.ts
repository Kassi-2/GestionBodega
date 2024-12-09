import { User } from './../../../core/models/user.interface';
import { LendingService } from './../../../core/services/lending.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgxScannerQrcodeModule, ScannerQRCodeResult, ScannerQRCodeConfig, NgxScannerQrcodeComponent, ScannerQRCodeDevice, NgxScannerQrcodeService } from 'ngx-scanner-qrcode';
import { delay } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'app-lending-add-qr',
  standalone: true,
  imports: [NgxScannerQrcodeModule, CommonModule, RouterModule],
  templateUrl: './lending-add-qr.component.html',
  styleUrls: ['./lending-add-qr.component.css']
})
export class LendingAddQrComponent {

  qrUser : User | undefined;

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      }
    },
    canvasStyles: {
      font: '17px serif',
      lineWidth: 1,
      fillStyle: '#ff001854',
      strokeStyle: '#ff0018c7',
    } as any,
  };


  @ViewChild('action')
  action!: NgxScannerQrcodeComponent;

  constructor(
    private scanner: NgxScannerQrcodeService,
    private lendingService: LendingService,
    private router: Router,
    private userService: UserService
  ) {}

  ngAfterViewInit(): void {
    this.action.isReady.pipe(delay(1000)).subscribe(() => {
      this.handle(this.action, 'start');
    });
  }

  ngOnDestroy(): void {
    if (this.action) {
      this.action.stop();
    }
  }
/**
 * Función que lee el código Qr y si es positivo el resultado del backend, setea el usuario seleccionado y redirecciona al siguiente paso de creación del préstamo.
 *
 * @param {ScannerQRCodeResult[]} e
 * @param {*} [action]
 * @memberof LendingAddQrComponent
 */
public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    if (e?.length) {
      action?.pause();

      const qrCode = e[0]?.value;

      if (qrCode) {


        this.userService.readCode(qrCode).subscribe({
          next: (result: any) => {

            if ('borrower' in result) {
              const borrower = result.borrower as User;
              if (borrower) {
                Swal.fire({
                  title: 'Código QR Escaneado',
                  text: `Usuario seleccionado: ${borrower.name}`,
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                });
                this.lendingService.setCurrentStep(2);
                this.lendingService.setSelectedUser(borrower);
                this.router.navigate(['/lending-add']);
              }
            }
          },
          error: (error) => {
            console.error(error);
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

      } else {
        console.warn('No se pudo obtener el valor del QR');
      }
    }
  }

/**
 * Funciónn para iniciar la cámara como lector de qr.
 *
 * @param {*} action
 * @param {string} fn
 * @memberof LendingAddQrComponent
 */
public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: ScannerQRCodeDevice[]) => {
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label)));
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }
}
