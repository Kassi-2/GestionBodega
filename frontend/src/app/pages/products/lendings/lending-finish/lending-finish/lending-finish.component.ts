import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { LendingOptionsComponent } from '../../lending-options/lending-options/lending-options.component';

interface Lending {
  id: number;
  name: string;
  date: string;
  associated: boolean;

}

@Component({
  selector: 'app-lending-finish',
  standalone: true,
  imports: [NgbAccordionModule, LendingOptionsComponent],
  templateUrl: './lending-finish.component.html',
  styleUrl: './lending-finish.component.css'
})
export class LendingFinishComponent {
  activeLendings: Lending[] = [];

  constructor() {}

  ngOnInit() {

    this.activeLendings = [
      { id: 1, name: 'Préstamo finalizado', date: '2023-08-03' , associated: false},
      { id: 2, name: 'Préstamo finalizado 2', date: '2023-04-10', associated: true },
    ];

    this.activeLendings.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

}
