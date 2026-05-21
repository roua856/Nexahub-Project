import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  getByCompany(company: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/company/${company}`);
  }

  getMe(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/me`);
  }

  invite(data: any): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/invite`, data);
  }

  update(id: number, data: any): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changePassword(data: any): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/change-password`, data);
  }
}