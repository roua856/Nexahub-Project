import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PermissionService {

  private apiUrl = 'http://localhost:8080/api/permissions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }

  create(permission: any): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, permission);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}