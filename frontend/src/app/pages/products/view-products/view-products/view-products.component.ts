import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { debounceTime } from 'rxjs/operators';
import { Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product.service';



@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})

export class ViewProductsComponent implements OnInit {
  public products = new Array<Product>

  constructor(private productService: ProductService) {
    // Llamada al servicio en el constructor
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
  searchTerm: string = '';


  filteredTools = []

  // get filteredItems() {
  //   return this.products.filter(item =>
  //     item.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }

  deleteProduct(idProduct: number): void {
    this.products = this.products.filter(item => item.idProduct !== idProduct);
  }

  ngOnInit() {

    };


}
