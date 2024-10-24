import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService],
})
export class LoginComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
  
  constructor(private authService: AuthService, private router: Router) {}

  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  public login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (result) => {
        alert('Inicio de sesion correctamente');
        this.router.navigateByUrl('lendings/active');
      },
      error: (error) =>{
        alert(error.message);
      },
    });
  }
}
