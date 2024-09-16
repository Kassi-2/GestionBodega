import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../core/models/products.interface';
import { ProductService } from '../../../../core/services/product.service';
import { PopoverModule } from '@coreui/angular';
import { Popover } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PopoverModule],
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})

export class ViewProductsComponent implements OnInit {

  public userForm!: FormGroup;

  private originalProduct: Product | null = null;

  selectedProductId: number | null = null;

  products: Product[] = [];

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
      status: [true],
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
  // Configurar el estilo personalizado para los botones
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger me-2"
    },
    buttonsStyling: false
  });

  // Mostrar la alerta de confirmación
  swalWithBootstrapButtons.fire({
    title: "¿Estás seguro?",
    text: "¡Estás a punto de eliminar un producto!",
    icon: "error",
    iconHtml: '<i class="custom-icon bi bi-exclamation-triangle-fill"></i>',
    showCancelButton: true,
    confirmButtonText: "Sí, estoy seguro",
    cancelButtonText: "No, cancelar",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
        this.productService.deleteProduct(idProduct);
        this.getProducts();

        swalWithBootstrapButtons.fire({
          title: "¡Eliminado!",
          text: "El producto ha sido eliminado exitosamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "El producto no se ha eliminado.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

//Editar producto, se edita el nombre del producto, la descripción del producto, el stock del producto,
//el stock crítico del producto y si es fungible.
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

    const updatedProduct: Product = {idProduct: this.selectedProductId, ...this.forma.value };

    if (!this.productService.nameUnique(updatedProduct.name, updatedProduct.idProduct)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre duplicado',
        text: 'Ya existe un producto con ese nombre. Por favor, elija un nombre diferente.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (this.originalProduct && JSON.stringify(this.originalProduct) === JSON.stringify(updatedProduct)) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "El producto se actualizo con exito!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.productService.updateProduct(updatedProduct).subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "El producto se actualizo con exito!",
        showConfirmButton: false,
        timer: 1500
      });
      this.getProducts();
    });

    this.forma.reset();
  }
}
