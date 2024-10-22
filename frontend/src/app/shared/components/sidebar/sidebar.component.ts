<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
=======
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
>>>>>>> origin/dev3-leandro

@Component({
  selector: 'app-sidebar',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterModule],
=======
  imports: [RouterLink, AlertsComponent, NgbToastModule],
>>>>>>> origin/dev3-leandro
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public show = true;
}
