import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComplianceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.accountsApiUrl}/api/accounts/admin`;

  private headers(): HttpHeaders {
    const token = localStorage.getItem('admin_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** GET all customers — we filter pending ones in the component */
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customers`, { headers: this.headers() });
  }

  /** GET pending accounts */
  getPendingAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pending-accounts`, { headers: this.headers() });
  }

  /** Approve a single account */
  approveAccount(accountId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/approve-account/${accountId}`, {}, { headers: this.headers() });
  }

  /** Approve all accounts for a user */
  approveAllAccounts(userId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/approve-all/${userId}`, {}, { headers: this.headers() });
  }

  /** Approve user (set status Active + send SMS) */
  approveUser(userId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/approve-user/${userId}`, {}, { headers: this.headers() });
  }

  /** Freeze / unfreeze an account */
  toggleFreezeAccount(accountId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${accountId}/freeze`, {}, { headers: this.headers() });
  }
}
