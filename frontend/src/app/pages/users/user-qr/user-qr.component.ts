import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.interface';

@Component({
  selector: 'app-user-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-qr.component.html',
  styleUrl: './user-qr.component.css'
})
export class UserQrComponent {
  @Input() user!: User;

  ngOnInit(): void {

  }

}
