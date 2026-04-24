import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminNotification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  referenceId: number | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.notificationsApiUrl}/api/notifications`;
  
  public unreadUpdated$ = new Subject<void>();

  private headers(): HttpHeaders {
    const token = localStorage.getItem('admin_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllNotifications(page = 0, size = 50): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/admin/all?page=${page}&size=${size}`,
      { headers: this.headers() }
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/admin/${id}/read`,
      {},
      { headers: this.headers() }
    );
  }
}
