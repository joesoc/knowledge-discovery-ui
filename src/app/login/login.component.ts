import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  loginFailed: boolean = false;

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;
  
    this.loginService.login(username ?? '', password ?? '').subscribe({
      next: (success) => {
        if (success) {
          // Handle successful login, possibly redirecting the user
          this.loginFailed = false;
          this.router.navigate(['/search']); // Use the injected Router module
        } else {
          // Handle failed login
          this.loginFailed = true;
        }
      },
      error: (error) => {
        // Handle any error that might occur during login
        console.error('Login error:', error);
        this.loginFailed = true;
      },
    });
}
}
