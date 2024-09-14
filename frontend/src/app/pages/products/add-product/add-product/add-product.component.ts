import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Product } from '../../../../core/models/product.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopoverModule } from '@coreui/angular';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, PopoverModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  public products: Product[] = [
    { idProduct: 0, name: '', description: '', stock: 0, criticalStock: 0, status: true, isFungible: false },
  ];
  private subscription: Subscription = new Subscription();
  public userForm!: FormGroup;
  isFungible: boolean = false;
  succesfulEntry: boolean = true;

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      idProduct: new FormControl(),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(null),
      stock: new FormControl('', [Validators.min(0)]),
      criticalStock: new FormControl('', [Validators.required]),
      isFungible: new FormControl(false)
    });
  }

  get notValidName() {
    return this.userForm.get('name')?.invalid && this.userForm.get('name')?.touched;
  }

  get notValidCriticalStock() {
    return this.userForm.get('criticalStock')?.invalid && this.userForm.get('criticalStock')?.touched;
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  closeModal() {
    this.userForm.reset();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.subscription.add(
      this.productService.getIDLastProduct().subscribe(lastId => {
        const newId = lastId + 1;

        const formValues = this.userForm.value;
        const stockValue = (formValues.stock === null || formValues.stock === '')
        ? 0
        : Number(formValues.stock);


        const newProduct: Product = {
          idProduct: newId,
          name: formValues.name,
          description: formValues.description ?? null,
          stock: stockValue,
          criticalStock: formValues.criticalStock,
          status: true,
          isFungible: formValues.isFungible ?? false,
        };

        this.subscription.add(
          this.productService.checkProductExists(newProduct.name).subscribe(exists => {
            if (exists) {
              alert('El producto ya existe. Por favor, ingrese otro nombre.');
            } else {
              this.productService.addProduct(newProduct);
              console.log('Producto agregado:', newProduct);

              this.userForm.reset({
                idProduct: null,
                name: '',
                description: null,
                stock: null,
                criticalStock: null,
                isFungible: false
              });
            }
          })
        );

      })
    );
  }
}
