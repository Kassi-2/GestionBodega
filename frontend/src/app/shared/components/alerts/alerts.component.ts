import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from '../../../core/models/alert.interface';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit, OnDestroy {
   ngOnInit(): void {
   }
   ngOnDestroy(): void {
   }
   
   public alerts: Alert[] = [];
}
