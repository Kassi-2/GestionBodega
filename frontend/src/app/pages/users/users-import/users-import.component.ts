import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Degree } from '../../../core/models/degree.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-import',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
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
    if(this.selectedFile){
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('type', this.form.get('type')?.value);
      formData.append('degree', this.form.get('degree')?.value || '');
      
      this.userService.importUsers(formData).subscribe({
        next: (result) => {
          alert('Usuarios importados correctamente' + result);
          window.location.reload();
        },
        error: (error) => {
          alert('Error al importar usuarios' + error)
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
