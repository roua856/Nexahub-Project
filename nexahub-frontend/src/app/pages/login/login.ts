import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  isLoginMode = true;
  loading = false;
  error = '';

  loginData = { email: '', motDePasse: '' };
  registerData = { nom: '', email: '', motDePasse: '', company: '' };

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.redirectByRole(this.authService.getRole());
    }
  }

  redirectByRole(role: string): void {
    if (role === 'SUPER_ADMIN') {
      this.router.navigate(['/super-admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.loading = true;
    this.error = '';
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveUser(response);
        this.redirectByRole(response.role);
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  register(): void {
    this.loading = true;
    this.error = '';
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveUser(response);
        this.redirectByRole(response.role);
      },
      error: () => {
        this.error = 'Registration failed. Email may already exist.';
        this.loading = false;
      }
    });
  }
}