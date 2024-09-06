import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  tools = [
    {id: 1, name: 'Martillo', stock: 10, description: 'Martillos de alta calidad, son de diamante, cuidado¡'},
    {id: 2, name: 'Alicate', stock: 6, description: 'Alicate de antofa'},
    {id: 3, name: 'Tornillos', stock: 40, description: 'Tornillos de punta fina y gruesa'},
    {id: 4, name: 'Confort', stock: 10, description: 'Confort del perrito wau'},
    {id: 5, name: 'Cloro', stock: 10, description: 'Cloro del perrito yea'}
  ];

  deleteProduct(id: number): void {
    this.tools = this.tools.filter(item => item.id !== id);
  }

  constructor() { }


  ngOnInit() {
  }

}
