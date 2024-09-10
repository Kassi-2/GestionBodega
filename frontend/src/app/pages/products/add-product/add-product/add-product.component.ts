import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators } from '@angular/forms';
import { PopoverModule } from '@coreui/angular';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, PopoverModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  products: Product[] = [];
  product: Product = new Product(0, '', '', 0, 0, true, false);
  private subscription: Subscription = new Subscription();


  forma!: FormGroup;

  exampleStock: number = 0;
  isFungible: boolean = false;
  lastId: number = 0


  constructor(private fb: FormBuilder, private productService: ProductService){
    this.createForm();
  }
  ngOnInit(){
  }

  createForm() {
    this.forma = this.fb.group({

      name: ['', [Validators.required]],
      description: [''],
      stock: ['', Validators.min(0)],
      criticalStock: [''],
      isFungible: [false]
    })
  }

  get notValidName(){

    return this.forma.get('name')?.invalid && this.forma.get('name')?.touched;

  }

  get notValidCriticalStock(){

    return this.forma.get('criticalStock')?.invalid && this.forma.get('criticalStock')?.touched;

  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  closeModal(){
    return Object.values(this.forma.controls).forEach(control => {

      control.reset();
      control.markAsUntouched();

    });
  }

  onSubmit() {

    if (this.forma.invalid){

      return Object.values(this.forma.controls).forEach(control => {

        control.markAllAsTouched();

      });

    }

    this.subscription.add(
      this.productService.getIDLastProduct().subscribe(lastId => {
        const newId = lastId + 1;
        const formValues = this.forma.value;

        const fungibleValue = this.forma.get('isFungible')?.value;
        this.product.fungible = fungibleValue

        const newProduct = new Product(
          newId,
          this.product.name,
          this.product.description,
          this.product.stock,
          this.product.criticalStock,
          true,
          this.product.fungible
        );

        this.products.push(newProduct);

        console.log(newProduct)
        console.log(this.forma)


        return Object.values(this.forma.controls).forEach(control => {

          control.reset();
          this.product = new Product(0, '', '', 0, 0, true, false);
        });
      }
    )
    )
  }

  }





