import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
