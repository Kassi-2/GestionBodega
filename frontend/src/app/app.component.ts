import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showSidebar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (this.router.url === '/auth/login') {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
      }
    });
  }
}
