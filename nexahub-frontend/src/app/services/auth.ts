import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:9090/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // =========================
  // AUTH API
  // =========================

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  // =========================
  // STORAGE
  // =========================

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveUser(user: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string {
    return this.getUser()?.role ?? '';
  }

  getCompany(): string {
    return this.getUser()?.company ?? '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isManager(): boolean {
    return this.getRole() === 'MANAGER';
  }

  isEmployee(): boolean {
    const role = this.getRole();
    return role === 'USER' || role === 'EMPLOYEE';
  }

  isAdminOrManager(): boolean {
    return this.isAdmin() || this.isManager();
  }

  redirectByRole(role: string): void {
    this.router.navigate(['/dashboard']);
  }

  getPermissions(): string[] {
    const role = this.getRole();

    if (role === 'ADMIN') {
      return [
        'VIEW_USERS','CREATE_USERS','BLOCK_USERS', 'VIEW_TASKS', 'CREATE_TASK',
        'UPDATE_TASK', 'VIEW_ROLES', 'VIEW_AUDIT', 'VIEW_ANNOUNCEMENTS',
        'VIEW_PROFILE', 'EDIT_USERS', 'DELETE_ANNOUNCEMENT', 'CREATE_ANNOUNCEMENT','VIEW_NOTIFICATIONS','CHANGE_PASSWORD'
      ];
    }

    const user = this.getUser();
    return user?.permissions || [];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  // =========================
  // LOGOUT
  // =========================

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}