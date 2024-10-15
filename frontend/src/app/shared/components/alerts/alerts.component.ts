import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from '../../../core/models/alert.interface';
import { AlertService } from '../../../core/services/alert.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
  providers: [AlertService]
})
export class AlertsComponent implements OnInit, OnDestroy {

  constructor(private alertService: AlertService) {}

   ngOnInit(): void {
    this.getAllAlerts();
    this.scheduleDailyAlert();
   }
   ngOnDestroy(): void {
   }
   
   public alerts: Alert[] = [];
   private hasAlertBeenSentToday: boolean = false;
   
   private getAllAlerts() {
    this.alertService.getAllAlert().subscribe((alerts: Alert[]) => {
      this.alerts = alerts;
      console.log(alerts);
    });
   }

   private scheduleDailyAlert() {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      console.log(now);
      if (currentHour >= 1 && !this.hasAlertBeenSentToday) {
        this.sendAlert();
      }
    };
    setInterval(checkTime, 10000);
  }

  private sendAlert() {
    this.alertService.createAlert().subscribe({
      next: (result) => {
        this.resetDailyFlagAtMidnight();
        console.log('Alerta creada:', result);
        this.hasAlertBeenSentToday = true;
      },
      error: (error) => {
        console.error('Error al crear la alerta:', error);
      }
    });
  }

  private resetDailyFlagAtMidnight() {
    const now = new Date();
    const timeUntilMidnight = (24 - now.getHours()) * 60 * 60 * 1000; 
    setTimeout(() => {
      this.hasAlertBeenSentToday = false;
    }, timeUntilMidnight);
  }
}
