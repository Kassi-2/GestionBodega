import { Component } from '@angular/core';

@Component({
  selector: 'app-add-lending',
  standalone: true,
  imports: [],
  templateUrl: './add-lending.component.html',
  styleUrl: './add-lending.component.css'
})
export class AddLendingComponent {
  progressStatus : number = 1;
}
