import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../core/models/products.interface';
import { ProductService } from '../../../../core/services/product.service';
import { PopoverModule } from '@coreui/angular';
import { Popover } from 'bootstrap';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PopoverModule],
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})

export class ViewProductsComponent implements OnInit {

  private originalProduct: Product | null = null;
  selectedProductId: number | null = null;


  public userForm!: FormGroup;

  products: Product[] = []

  forma!: FormGroup;

  exampleStock: number = 0;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.forma = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      stock: ['', Validators.min(0)],
      criticalStock: [''],
      status: [false],
      isFungible: [false]

    })
  }


  ngOnInit(): void {
    this.getProducts();

    this.userForm = new FormGroup({
      idProduct: new FormControl(),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(null),
      stock: new FormControl('', [Validators.min(0)]),
      criticalStock: new FormControl('', [Validators.required]),
      isFungible: new FormControl(false)
    });
  }

  get notValidName(){
    return this.forma.get('name')?.invalid && this.forma.get('name')?.touched;
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

//Buscador de productos
  searchTerm: string = ''
    filteredList() {
    return this.products.filter(products =>
      products.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

//Obtener todos los productos
  getProducts(): void {
    this.products = this.productService.getProducts();
  }

//Eliminar un producto
  deleteProduct(idProduct: number): void {
    this.productService.deleteProduct(idProduct);
    this.getProducts();
  }

//Editar producto
  editProduct(idProduct: number) {
    this.selectedProductId = idProduct;
    const product = this.productService.getProductForEdit(idProduct);

    if (product) {

      this.originalProduct = { ...product };

      this.forma.patchValue({
        name: product.name,
        description: product.description,
        stock: product.stock,
        criticalStock: product.criticalStock,
        isFungible: product.isFungible
      });
    }
  }


// enviar datos editados del producto
  onSubmit() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    console.log(this.originalProduct);


    const updatedProduct: Product = { ...this.forma.value, idProduct: this.selectedProductId };
    console.log("esto es" + updatedProduct);

    if (this.originalProduct && JSON.stringify(this.originalProduct) === JSON.stringify(updatedProduct)) {
      // Si los valores no han cambiado, no actualiza el producto y muestra un mensaje si es necesario
      console.log('No hay cambios en el producto.');
      return;
    }

    this.productService.updateProduct(updatedProduct).subscribe(response => {
      this.getProducts();
    });

    this.forma.reset();
  }
}
