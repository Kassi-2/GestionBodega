import { Component } from '@angular/core';
import { LendingAddComponent } from '../../lending-add/lending-add/lending-add.component';

@Component({
  selector: 'app-lending-active-list',
  standalone: true,
  imports: [LendingAddComponent],
  templateUrl: './lending-active-list.component.html',
  styleUrl: './lending-active-list.component.css'
})
export class LendingActiveListComponent {

}
