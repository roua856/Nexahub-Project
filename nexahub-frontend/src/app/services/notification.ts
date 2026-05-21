import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppNotification } from '../models/models';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private api = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.api);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/count`);
  }

  markRead(): Observable<void> {
    return this.http.post<void>(`${this.api}/read`, {});
  }
}