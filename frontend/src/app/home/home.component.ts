import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  herramienta = [
    {id: 1, nombre: 'Martillo', stock: 10, descripcion: 'Martillos de alta calidad, son de diamante, cuidado¡'},
    {id: 2, nombre: 'Alicate', stock: 6, descripcion: 'Alicate de antofa'},
    {id: 3, nombre: 'Tornillos', stock: 40, descripcion: 'Tornillos de punta fina y gruesa'},
    {id: 4, nombre: 'Confort', stock: 10, descripcion: 'Confort del perrito wau'},
    {id: 5, nombre: 'Cloro', stock: 10, descripcion: 'Cloro del perrito yea'}
  ];

  deleteProduct(id: number): void {
    this.herramienta = this.herramienta.filter(item => item.id !== id);
  }

}
