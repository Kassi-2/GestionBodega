import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopoverModule } from '@coreui/angular';
import { Popover } from 'bootstrap';



@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, PopoverModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  products: Product[] = [];
  product: Product = new Product(0, '', '', 0, 0, 'Active', 'Available');

  forma!: FormGroup;

  exampleStock: number = 0;



  constructor(private fb: FormBuilder){
    this.createForm();
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



  onSubmit() {

    if (this.forma.invalid){

      return Object.values(this.forma.controls).forEach(control => {

        control.markAllAsTouched();

      });

    }


    const status = this.product.stock > this.product.criticalStock ? 'Available' : 'Unavailable';

    const newId = this.products.length ? Math.max(...this.products.map(p => p.idProduct)) + 1 : 1;

    this.product.stock = this.exampleStock

    const newProduct = new Product(
      newId,
      this.product.name,
      this.product.description,
      this.product.stock,
      this.product.criticalStock,
      'Active',
      status
    );


    this.products.push(newProduct);

    console.log(newProduct)
    console.log(this.forma)

    this.product = new Product(0, '', '', 0, 0, 'Active', 'Available');

    return Object.values(this.forma.controls).forEach(control => {

      control.reset();

    });

  }



  ngOnInit() {
  }

}
