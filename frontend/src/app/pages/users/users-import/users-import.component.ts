import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Degree } from '../../../core/models/degree.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-users-import',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './users-import.component.html',
  styleUrl: './users-import.component.css',
  providers: [UserService],
})
export class UsersImportComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}



  ngOnInit(): void {
    this.getAllDegrees();
  }
  ngOnDestroy(): void {
  }



  public degrees!: Degree[];
  public form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    degree: new FormControl(),
    file: new FormControl('', Validators.required),
  });
  public selectedFile!: File;

  public import(): void {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2',
        title: 'custom-title-font',
      },
      buttonsStyling: false,
    });

    if(this.selectedFile){
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('type', this.form.get('type')?.value);
      formData.append('degree', this.form.get('degree')?.value || '');

      this.userService.importUsers(formData).subscribe({
        next: (result) => {
          swalWithBootstrapButtons.fire({
            title: 'Importación exitosa',
            text: 'La importación de usuarios se realizó exitosamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        error: (error) => {
          swalWithBootstrapButtons.fire({
                title: 'Error',
                text: 'Ocurrió un error en la importación, verifique el tipo de archivo ingresado o solicite ayuda.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);
        }

      })
    }
  }

  public onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  private getAllDegrees() {
    this.userService.getAllDegrees().subscribe((degrees: Degree[]) => {
      this.degrees = degrees;
    });
  }


}
