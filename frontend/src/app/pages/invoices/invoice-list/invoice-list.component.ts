import { Component } from '@angular/core';
import { InvoiceAddComponent } from "../invoice-add/invoice-add.component";

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [InvoiceAddComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent {

}
