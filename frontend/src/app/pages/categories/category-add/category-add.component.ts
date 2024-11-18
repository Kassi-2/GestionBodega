import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Category,
  CategoryRegister,
} from '../../../core/models/category.interface';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css',
  providers: [CategoryService],
})
export class CategoryAddComponent implements OnInit, OnDestroy {
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  public categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  public createCategory() {
    const category: CategoryRegister = {
      name: this.categoryForm.get('name')?.value,
    };

    this.categoryService.createCategory(category).subscribe({
      next: (response: Category) => {
        Swal.fire({
          title: 'Agregada!',
          text: `La categoría ${response.name} ha sido agregada de forma exitosa`,
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
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  }

  get notValidName() {
    return (
      this.categoryForm.get('name')?.invalid &&
      this.categoryForm.get('name')?.touched
    );
  }

  public clearForm() {
    this.categoryForm.reset({
      name: '',
    });
  }
}
