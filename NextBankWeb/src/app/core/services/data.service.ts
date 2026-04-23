import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Customer {
  id: number;
  initials: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  status: 'Active' | 'Pending' | 'Frozen' | 'Under Review';
  balance: number;
  accounts: number;
  cards: number;
  joined: string;
  joinedAgo: string;
  qrCodeBase64?: string;
  qrTokenHash?: string;
  rawAccounts?: any[];
}

export interface StatCard {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/accounts/admin`;

  getCustomers(): Observable<any[]> {
    const token = localStorage.getItem('admin_token');
    return this.http.get<any[]>(`${this.baseUrl}/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getGlobalStats(): Observable<any> {
    const token = localStorage.getItem('admin_token');
    return this.http.get<any>(`${this.baseUrl}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getStats(): StatCard[] {
    return [
      { icon: '💳', iconBg: '#22c55e', label: 'Total Revenue',  value: '142 800 000 XAF', change: '↑ 12.5%', changeUp: true },
      { icon: '👥', iconBg: '#3b82f6', label: 'Active Users',   value: '24,521',           change: '↑ 8.2%',  changeUp: true },
      { icon: '↔',  iconBg: '#8b5cf6', label: 'Transactions',   value: '3,420',            change: '↑ 3.1%',  changeUp: true },
      { icon: '💳', iconBg: '#f59e0b', label: 'Active Cards',   value: '18,342',           change: '↓ 1.2%',  changeUp: false },
    ];
  }

  getRecentCustomers(): Customer[] {
    // This is now used as a fallback or for initial display if needed, but we prefer getCustomers()
    return [];
  }

  getRevenueData() {
    return {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      values: [4.1, 4.8, 4.6, 5.8, 7.2, 8.1, 8.5, 9.2, 10.1, 11.4, 12.8, 14.2],
    };
  }

  getWeeklyActivity() {
    return {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      deposits:    [4.2, 5.1, 5.8, 4.9, 6.2, 3.1, 2.4],
      withdrawals: [2.1, 2.8, 3.2, 2.4, 3.8, 1.8, 1.2],
      transfers:   [1.8, 2.2, 2.6, 2.1, 2.9, 1.4, 0.9],
    };
  }

  getAccountTypes() {
    return [
      { label: 'Checking', value: 45, color: '#3b82f6' },
      { label: 'Savings',  value: 35, color: '#10b981' },
      { label: 'Business', value: 20, color: '#f59e0b' },
    ];
  }

  getSecurityAlerts() {
    return [
      { id: 4829, type: 'warning', title: 'Unusual login pattern',    time: '5 min ago',  severity: 'high'   },
      { id: 3271, type: 'alert',   title: 'Large withdrawal flagged', time: '22 min ago', severity: 'medium' },
      { id: 1893, type: 'info',    title: 'KYC document expired',     time: '1h ago',     severity: 'low'    },
    ];
  }
}
