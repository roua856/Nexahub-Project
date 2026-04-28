import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoriqueAction } from '../models/models';

@Injectable({ providedIn: 'root' })
export class HistoriqueService {

  private apiUrl = 'http://localhost:8080/api/history';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HistoriqueAction[]> {
    return this.http.get<HistoriqueAction[]>(this.apiUrl);
  }

  getByCompany(company: string): Observable<HistoriqueAction[]> {
    return this.http.get<HistoriqueAction[]>(
      `${this.apiUrl}/company/${company}`);
  }
}