import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../../core/models/product.interface';
import { ProductService } from '../../../core/services/product.service';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { AddProductComponent } from '../add-product/add-product.component';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddProductComponent,
    HttpClientModule,
    NgbPagination,
  ],
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
  providers: [ProductService],
})
export class ViewProductsComponent implements OnInit {
  public page = 1;
  public pageSize = 10;

  public forma!: FormGroup;

  selectedProductId: number | null = null;
  products: Product[] = [];
  exampleStock: number = 0;

  //Estos atributos serviran para buscar un producto según el nombre y para la paginación de la lista de productos.
  searchTerm: string = '';
  start: number = 0;
  end: number = this.pageSize;
  selectedOption: string = '';

  //Esta función constructor crea el formulario con el que se va a trabajar (para agregar o editar un producto).
  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.createForm();
  }

  // Inicializamos el formulario con valores predeterminados (formato del producto).
  createForm() {
    this.forma = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      stock: ['', Validators.min(0)],
      criticalStock: [''],
      fungible: [false],
    });
  }

  //Esta funcion obtiene los productos de la lista.
  ngOnInit(): void {
    this.getProducts();
  }

  //Esta función es para validar si el campo del nombre esta correcto, esto muestra un mensaje.
  get notValidName() {
    return this.forma.get('name')?.invalid && this.forma.get('name')?.touched;
  }

  //Esta función es para actualizar la opción seleccionada.
  selectOption(option: string) {
    this.selectedOption = option;
  }

  //Este función es para evitar que se ingrese ciertos cáracteres.
  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  //Filtrar la lista por el nombre y por ordenar productos por paginación.
  filteredList(): Product[] {
    const filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.id.toString().includes(this.searchTerm.toLowerCase())
    );
    return filteredProducts;
  }

  // Obtener todos los productos de la lista.
  getProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  // Eliminar un producto de la lista (muestra una alerta de confimar eliminación).
  deleteProduct(idProduct: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro?',
        text: `¡Estás a punto de eliminar este producto!`,
        iconHtml: `
          <div style="
            background-color: FCBF49;
            border-radius: 50%;
            width: 4rem;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>`,
        showCancelButton: true,
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(idProduct).subscribe({
            next: (response) => {
              swalWithBootstrapButtons.fire({
                title: '¡Eliminado!',
                text: 'El producto ha sido eliminado exitosamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
              });

              this.getProducts();
            },
          });
        } else {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            text: 'El producto no se ha eliminado.',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
  }

  // Esta funcion obtiene la información de un producto según su idProducto, rellenando el formulario con la
  // información del producto correspondiente al idProducto.
  editProduct(idProduct: number) {
    this.selectedProductId = idProduct;
    let product!: Product;
    this.productService.getProductForEdit(idProduct).subscribe({
      next: (response) => {
        product = response;

        this.forma.patchValue({
          name: product.name,
          description: product.description,
          stock: product.stock,
          criticalStock: product.criticalStock,
          fungible: product.fungible,
        });
      },

      error: (error) => {
        alert(error.error.message);
      },
    });
  }
  //Funcion que ordena la lista de productos según la opción que escogio.
  onSelected(option: string) {
    this.selectedOption = option;
    this.productService.filterListProduct(this.selectedOption).subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
        console.error(error.error.message);
      },
    });
  }

  // Editar un producto de la lista (muestra una alerta de confirmar la edición) y se asegura que la información
  // enviada del formuario cumpla con las restricciones, como puede ser que el nombre no se repita con otro producto
  // o que el formulario fuese invalido según sus validaciones.
  onSubmit() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((control) => {
        control.markAllAsTouched();
      });
    }

    const updatedProduct: Product = {
      id: this.selectedProductId,
      ...this.forma.value,
    };

    this.productService
      .updateProduct(updatedProduct.id, updatedProduct)
      .subscribe({
        next: (response) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'El producto se actualizo con exito!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getProducts();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            confirmButtonText: 'Aceptar',
          });
          return;
        },
      });

    this.forma.reset();
  }
}