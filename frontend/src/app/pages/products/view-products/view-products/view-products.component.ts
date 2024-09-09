import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product.service';
import { PopoverModule } from '@coreui/angular';
import { Popover } from 'bootstrap';




@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PopoverModule],
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})

export class ViewProductsComponent implements OnInit {
  public products = new Array<Product>

  forma!: FormGroup;

  exampleStock: number = 0;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.createForm();


    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  createForm() {
    this.forma = this.fb.group({

      name: ['', [Validators.required]],
      description: [''],
      stock: ['', Validators.min(0)],
      criticalStock: ['']

    })
  }
  get notValidName(){

    return this.forma.get('name')?.invalid && this.forma.get('name')?.touched;

  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  editProduct(product: Product) {
    this.forma.patchValue({
      name: product.name,
      description: product.description,
      stock: product.stock,
      criticalStock: product.criticalStock
    });
  }


  onSubmit() {

    if (this.forma.invalid){

      return Object.values(this.forma.controls).forEach(control => {

        control.markAllAsTouched();

      });

    }

    return Object.values(this.forma.controls).forEach(control => {

      control.reset();

    });

  }

  searchTerm: string = ''
    filteredList() {
    return this.products.filter(products =>
      products.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteProduct(idProduct: number): void {
    this.products = this.products.filter(item => item.idProduct !== idProduct);
  }

  ngOnInit() {

    };


}
