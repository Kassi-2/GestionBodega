import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '../../../core/models/category.interface';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { CategoryService } from '../../../core/services/category.service';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CategoryAddComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit, OnDestroy {
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.getAllCategories();
  }
  ngOnDestroy(): void {}

  public categories!: Category[];
  public category!: Category;
  public categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  public getAllCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  public editCategory(id: number) {
    const editedCategory: Category = {
      id: id,
      name: this.categoryForm.get('name')?.value,
    };

    this.categoryService.editCategory(editedCategory, id).subscribe({
      next: (response: Category) => {
        Swal.fire({
          title: '¡Editada!',
          text: `La categoría ${response.name} ha sido editada exitosamente.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (error) => {
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: error.error.message,
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  }

  public deleteCategory(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `!Estás a punto de eliminar a la categoría ${id}!.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      confirmButtonColor: 'green',
      cancelButtonText: 'No, Cancelar',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (response: Category) => {
            Swal.fire({
              title: '¡Eliminado!',
              text: `La categoría ${response.name} ha sido eliminado exitosamente.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });

            this.getAllCategories();
          },
          error: (error) => {
            Swal.fire({
              title: 'Ha ocurrido un error',
              text: error.error.message,
              icon: 'error',
              timer: 1500,
              showConfirmButton: false,
            });
          },
        });
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'La categoría no se ha eliminado.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  get notValidName() {
    return (
      this.categoryForm.get('name')?.invalid &&
      this.categoryForm.get('name')?.touched
    );
  }

  public patchFormValues(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category: Category) => {
        this.category = category;
        this.categoryForm.patchValue({
          name: category.name,
        });
      },
    });
  }
}
