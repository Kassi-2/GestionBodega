import { User } from './../../../core/models/user.interface';
import { LendingService } from './../../../core/services/lending.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgxScannerQrcodeModule, ScannerQRCodeResult, ScannerQRCodeConfig, NgxScannerQrcodeComponent, ScannerQRCodeDevice, NgxScannerQrcodeService } from 'ngx-scanner-qrcode';
import { delay } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-lending-add-qr',
  standalone: true,
  imports: [NgxScannerQrcodeModule, CommonModule],
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
    private qrcode: NgxScannerQrcodeService,
    private lendingService: LendingService,
    private router: Router,
    private userService: UserService
  ) {}

  ngAfterViewInit(): void {
    this.action.isReady.pipe(delay(1000)).subscribe(() => {
      this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    if (e?.length) {
      action?.pause();

      const qrRut = e[0]?.value;

      if (qrRut) {
        console.log('Valor del QR:', qrRut);


        this.userService.getUserByRut(qrRut).subscribe({
          next: (result) => {
            this.qrUser = result
            Swal.fire({
              title: 'Código QR Escaneado',
              text: `Usuario seleccionado: ${this.qrUser.name}`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            this.lendingService.setCurrentStep(2);
            this.router.navigate(['/lending-add']);
          },
          error: (error) => {
            alert(error.error.message);
            window.location.reload();
          },
        });

      } else {
        console.warn('No se pudo obtener el valor del QR');
      }
    }
  }


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
