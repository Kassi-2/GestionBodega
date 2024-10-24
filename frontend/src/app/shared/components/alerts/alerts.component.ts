import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from '../../../core/models/alert.interface';
import { AlertService } from '../../../core/services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgbToastModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
  providers: [AlertService],
})
export class AlertsComponent implements OnInit, OnDestroy {
  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.getAllAlerts();
    this.scheduleDailyAlert();
  }
  ngOnDestroy(): void {}

  public alerts: Alert[] = [];
  private hasAlertBeenSentToday: boolean = false;
  public show = false;
  public alert: Alert = {
    id: 0,
    state: false,
    date: new Date(),
    name: '',
    description: '',
  };

  private getAllAlerts() {
    this.alertService.getAllAlert().subscribe((alerts: Alert[]) => {
      this.alerts = alerts;
    });
  }

  private scheduleDailyAlert() {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour >= 17 && !this.hasAlertBeenSentToday) {
        this.sendAlert();
      }
    };
    setInterval(checkTime, 60000);
  }

  private sendAlert() {
    this.alertService.createAlert().subscribe({
      next: (result) => {
        this.hasAlertBeenSentToday = true;
        this.alert = result;
        const toastLiveExample = document.getElementById('toast');
        if (result.state == false) {
          const toastBootstrap = (
            window as any
          ).bootstrap.Toast.getOrCreateInstance(toastLiveExample);
          toastBootstrap.show();
        }
        setTimeout(() => {
          window.location.reload();
        }, 10000);
        this.resetDailyFlagAtMidnight();
      },
      error: (error) => {
        console.error('Error al crear la alerta:', error);
        return;
      },
    });
  }

  private resetDailyFlagAtMidnight() {
    const now = new Date();
    const timeUntilMidnight = (24 - now.getHours()) * 60 * 60 * 1000;
    setTimeout(() => {
      this.hasAlertBeenSentToday = false;
    }, timeUntilMidnight);
  }

  public getDaysAgo(alertDate: Date): string {
    const now = new Date();
    const alertDateTime = new Date(alertDate).getTime();
    const nowTime = now.getTime();

    const differenceInMilliseconds = nowTime - alertDateTime;
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    if (differenceInDays === 0) {
      return 'Hoy';
    } else if (differenceInDays === 1) {
      return 'Hace 1 día';
    } else {
      return `Hace ${differenceInDays} días`;
    }
  }

  public markAsViewed(alertId: number) {
    this.alertService.markAlertAsViewed(alertId).subscribe({
      next: (response) => {},
      error: (error) => {
        alert(error);
      },
    });
  }

  public deleteAlert(alertId: number) {
    this.alertService.deleteAlert(alertId).subscribe({
      next: (response) => {
        this.alerts.filter((a) => a.id !== response.id);
      },
      error: (error) => {
        alert(error);
      },
    });
  }
}
