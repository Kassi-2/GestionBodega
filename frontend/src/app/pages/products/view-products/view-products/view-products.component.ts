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
    {idProduct: 1, name: 'Martillo', stock: 10, description: 'Martillos de alta calidad, son de diamante, cuidado¡'},
    {idProduct: 2, name: 'Alicate', stock: 6, description: 'Alicate de antofa'},
    {idProduct: 3, name: 'Tornillos', stock: 40, description: 'Tornillos de punta fina y gruesa'},
    {idProduct: 4, name: 'Confort', stock: 10, description: 'Confort del perrito wau'},
    {idProduct: 5, name: 'Cloro', stock: 10, description: 'Cloro del perrito yea'}
  ];

  deleteProduct(idProduct: number): void {
    this.tools = this.tools.filter(item => item.idProduct !== idProduct);
  }

  constructor() { }


  ngOnInit() {
  }

}
