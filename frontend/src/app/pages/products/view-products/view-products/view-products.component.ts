import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../../../core/models/product.interface';
import { ProductService } from '../../../../core/services/product.service';
import { PopoverModule } from '@coreui/angular';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddProductComponent } from "../../add-product/add-product/add-product.component";

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule,
    MatPaginatorModule,
    AddProductComponent
],
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
})
export class ViewProductsComponent implements OnInit {
  public forma!: FormGroup;
  private originalProduct: Product | null = null;

  selectedProductId: number | null = null;
  products: Product[] = [];
  exampleStock: number = 0;

  //Estos atributos serviran para buscar un producto según el nombre y para la paginación de la lista de productos.
  searchTerm: string = '';
  pageSize = 3;
  start: number = 0;
  end: number = this.pageSize;
  selectedOption: string = 'A-Z';

  //Esta función constructor crea el formulario con el que se va a trabajar (para agregar o editar un producto).
  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.createForm();
  }

  //Esta función es para cambiar la página de la paginación de la lista de productos.
  changePage(e: PageEvent) {
    this.start = e.pageIndex * e.pageSize;
    this.end = Math.min(this.start + e.pageSize, this.products.length);
  }

  // Inicializamos el formulario con valores predeterminados (formato del producto).
  createForm() {
    this.forma = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      stock: ['', Validators.min(0)],
      criticalStock: [''],
      status: [true],
      isFungible: [false],
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
    const filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return filteredProducts.slice(this.start, this.end);
  }

  // Obtener todos los productos de la lista.
  getProducts(): void {
    this.products = this.productService.getProducts();
  }

  // Eliminar un producto de la lista (muestra una alerta de confimar eliminación).
  deleteProduct(idProduct: number): void {
    const productToDelete = this.products.find(
      (product) => product.idProduct === idProduct
    );

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });

    if (!productToDelete) {
      console.error('Producto no encontrado');
      Swal.fire({
        title: 'Error',
        text: 'El producto que intentas eliminar no existe.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro?',
        text: `¡Estás a punto de eliminar el producto "${productToDelete.name}"!`,
        iconHtml: `
          <div style="
            background-color: orange;
            border-radius: 50%;
            width: 4rem;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <i class="bi bi-exclamation-triangle-fill" style="color: grey; font-size: 2rem;"></i>
          </div>`,
        showCancelButton: true,
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(idProduct);
          this.getProducts();

          swalWithBootstrapButtons.fire({
            title: '¡Eliminado!',
            text: 'El producto ha sido eliminado exitosamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
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
    const product = this.productService.getProductForEdit(idProduct);

    if (product) {
      this.originalProduct = { ...product };

      this.forma.patchValue({
        name: product.name,
        description: product.description,
        stock: product.stock,
        criticalStock: product.criticalStock,
        isFungible: product.isFungible,
      });
    }
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
      idProduct: this.selectedProductId,
      ...this.forma.value,
    };

    if (
      !this.productService.nameUnique(
        updatedProduct.name,
        updatedProduct.idProduct
      )
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre duplicado',
        text: 'Ya existe un producto con ese nombre. Por favor, elija un nombre diferente.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    if (
      this.originalProduct &&
      JSON.stringify(this.originalProduct) === JSON.stringify(updatedProduct)
    ) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El producto se actualizo con exito!',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    this.productService.updateProduct(updatedProduct).subscribe((response) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El producto se actualizo con exito!',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getProducts();
    });

    this.forma.reset();
  }
}
