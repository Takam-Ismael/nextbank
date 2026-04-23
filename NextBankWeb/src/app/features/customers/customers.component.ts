import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService, Customer } from '../../core/services/data.service';

@Component({
  selector: 'nb-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="customers-page">

      <!-- PAGE HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Customers</h1>
          <p class="page-sub">{{ filtered().length }} registered customers</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-secondary" (click)="loadPendingAccounts()">
            Pending Accounts
          </button>
          <button class="btn-add" (click)="showRegister.set(true)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      <!-- FILTERS BAR -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input class="search-input" type="text" placeholder="Search by name or email..." [(ngModel)]="searchQuery"/>
        </div>
        <button class="filter-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filter
        </button>
        <button class="filter-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
      </div>

      <!-- TABLE CARD -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>CUSTOMER</th>
              <th>STATUS</th>
              <th>KYC</th>
              <th>ACCOUNTS</th>
              <th>BALANCE</th>
              <th>JOINED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of paginated(); trackBy: trackById">
              <td>
                <div class="cust-cell">
                  <div class="cust-avatar" [style.background]="avatarBg(c.initials)">{{ c.initials }}</div>
                  <div class="cust-info">
                    <div class="cust-name">{{ c.name }}</div>
                    <div class="cust-email">{{ c.email }}</div>
                  </div>
                </div>
              </td>
              <td><span class="status-badge" [ngClass]="statusClass(c.status)">{{ c.status }}</span></td>
              <td><span class="kyc-badge" [ngClass]="kycClass(c.status)">{{ kycLabel(c.status) }}</span></td>
              <td class="center-cell">{{ c.accounts }}</td>
              <td class="balance-cell">{{ fmtBalance(c.balance) }}</td>
              <td class="date-cell">{{ c.joined }}</td>
              <td>
                <button class="more-btn" (click)="viewCustomer(c)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="filtered().length === 0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          <p>No customers match your search.</p>
          <button class="btn-ghost" (click)="searchQuery = ''">Clear search</button>
        </div>

        <div class="pagination" *ngIf="filtered().length > 0">
          <span class="page-info">Showing {{ pageStart() }}–{{ pageEnd() }} of {{ filtered().length }}</span>
          <div class="page-btns">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="prevPage()">‹</button>
            <button *ngFor="let p of pageNumbers()" class="page-btn" [class.active]="p === currentPage()" (click)="currentPage.set(p)">{{ p }}</button>
            <button class="page-btn" [disabled]="currentPage() === totalPages()" (click)="nextPage()">›</button>
          </div>
        </div>
      </div>

      <!-- REGISTER MODAL -->
      <div class="modal-backdrop" *ngIf="showRegister()" (click)="closeRegister()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Add Customer</h2>
              <p class="modal-sub">Register a new customer account</p>
            </div>
            <button class="modal-close" (click)="closeRegister()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <form class="modal-form" (ngSubmit)="submitRegister()">
            <div class="form-grid">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" [(ngModel)]="reg.fullName" name="fullName" required placeholder="e.g. John Doe"/>
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" [(ngModel)]="reg.email" name="email" required placeholder="john@nextbank.cm"/>
              </div>
              <div class="form-group">
                <label>Phone Number *</label>
                <input type="tel" [(ngModel)]="reg.phone" name="phone" required placeholder="+237 699 123 456"/>
              </div>
              <div class="form-group">
                <label>National ID *</label>
                <input type="text" [(ngModel)]="reg.nationalId" name="nationalId" required placeholder="CMR-XXXXXXXXX"/>
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label>Account Types *</label>
                <div class="checkbox-group" style="display: flex; gap: 15px; margin-top: 5px;">
                  <label style="text-transform: none; font-weight: normal; font-size: 13px; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <input type="checkbox" [(ngModel)]="reg.accountTypes.CHECKING" name="acctChecking" /> Checking
                  </label>
                  <label style="text-transform: none; font-weight: normal; font-size: 13px; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <input type="checkbox" [(ngModel)]="reg.accountTypes.SAVINGS" name="acctSavings" /> Savings
                  </label>
                  <label style="text-transform: none; font-weight: normal; font-size: 13px; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <input type="checkbox" [(ngModel)]="reg.accountTypes.BUSINESS" name="acctBusiness" /> Business
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="closeRegister()">Cancel</button>
              <button type="submit" class="btn-add" [disabled]="registerLoading()">
                {{ registerLoading() ? 'Registering...' : 'Register Customer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- SUCCESS MODAL -->
      <div class="modal-backdrop" *ngIf="registrationSuccessUser()" (click)="registrationSuccessUser.set(null)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header" style="text-align: center; display: block;">
            <div style="background: #dcfce7; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 class="modal-title">Customer Registered!</h2>
            <p class="modal-sub">Account created successfully</p>
          </div>
          <div class="modal-form" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
            <div class="qr-container" style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px dashed #e5e7eb;">
              <img [src]="'data:image/png;base64,' + registrationSuccessUser()!.qrCodeBase64" alt="QR Code" style="width: 200px; height: 200px;"/>
              <p style="margin-top: 10px; font-family: monospace; font-size: 12px; color: #6b7280; text-align: center;">
                {{ registrationSuccessUser()!.qrTokenHash }}
              </p>
            </div>
            <div class="detail-grid" style="width: 100%;">
              <div class="detail-item">
                <span class="detail-label">Full Name</span>
                <span class="detail-value">{{ registrationSuccessUser()!.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone</span>
                <span class="detail-value">{{ registrationSuccessUser()!.phone }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-add" style="width: 100%; justify-content: center;" (click)="registrationSuccessUser.set(null)">
              Done
            </button>
          </div>
        </div>
      </div>

      <!-- PENDING ACCOUNTS MODAL -->
      <div class="modal-backdrop" *ngIf="showPending()" (click)="showPending.set(false)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Pending Account Requests</h2>
              <p class="modal-sub">Approve customer account requests</p>
            </div>
            <button class="modal-close" (click)="showPending.set(false)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-form">
            <div class="empty-state" *ngIf="pendingAccounts().length === 0">
              <p>No pending account requests.</p>
            </div>
            <div class="detail-item" *ngFor="let acc of pendingAccounts()" style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="detail-value">{{ acc.type }} Account</span>
                <span class="detail-label" style="display: block;">Number: {{ acc.accountNumber }}</span>
              </div>
              <button class="btn-add" style="padding: 6px 12px; font-size: 12px;" (click)="approveAccount(acc.id)">Approve</button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW MODAL -->
      <div class="modal-backdrop" *ngIf="selectedCustomer()" (click)="selectedCustomer.set(null)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="cust-cell">
              <div class="cust-avatar lg" [style.background]="avatarBg(selectedCustomer()!.initials)">{{ selectedCustomer()!.initials }}</div>
              <div>
                <h2 class="modal-title">{{ selectedCustomer()!.name }}</h2>
                <p class="modal-sub">{{ selectedCustomer()!.email }}</p>
              </div>
            </div>
            <button class="modal-close" (click)="selectedCustomer.set(null)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="detail-grid">
            <div class="detail-item" *ngFor="let d of customerDetails(selectedCustomer()!)">
              <span class="detail-label">{{ d.label }}</span>
              <span class="detail-value">
                <span *ngIf="d.isStatus" class="status-badge" [ngClass]="statusClass(d.value)">{{ d.value }}</span>
                <span *ngIf="!d.isStatus">{{ d.value }}</span>
              </span>
            </div>
          </div>
          
          <div *ngIf="selectedCustomer()?.qrCodeBase64" style="padding: 20px; border-top: 1px solid #f0f0f0; display: flex; flex-direction: column; align-items: center;">
            <span class="detail-label" style="margin-bottom: 10px;">Security QR Code</span>
            <img [src]="'data:image/png;base64,' + selectedCustomer()!.qrCodeBase64" alt="QR Code" style="width: 150px; height: 150px;"/>
            <p style="margin-top: 5px; font-family: monospace; font-size: 11px; color: #9ca3af;">{{ selectedCustomer()?.qrTokenHash }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-danger" (click)="toggleFreeze(selectedCustomer()!); selectedCustomer.set(null)">
              {{ selectedCustomer()!.status === 'Frozen' ? 'Unfreeze Account' : 'Freeze Account' }}
            </button>
            <button class="btn-secondary" (click)="selectedCustomer.set(null)">Close</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .customers-page { display: flex; flex-direction: column; gap: 20px; }

    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .page-title { font-size: 26px; font-weight: 800; color: var(--text-primary); }
    .page-sub   { font-size: 13px; color: var(--text-secondary); margin-top: 3px; }

    .btn-add {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 10px;
      background: #1e3a6e; color: #fff;
      font-size: 14px; font-weight: 600; cursor: pointer;
      border: none; transition: background 0.15s;
      &:hover { background: #162d56; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .filters-bar {
      display: flex; align-items: center; gap: 10px;
      background: #fff; border: 1px solid #e5e7eb;
      border-radius: 12px; padding: 12px 16px;
    }
    .search-wrap {
      display: flex; align-items: center; gap: 8px;
      flex: 1; max-width: 320px;
      background: #f9fafb; border: 1px solid #e5e7eb;
      border-radius: 8px; padding: 0 12px; height: 36px;
      color: #9ca3af;
      &:focus-within { border-color: #3b82f6; }
    }
    .search-input {
      flex: 1; border: none; background: transparent;
      font-size: 13px; color: #0d1117;
      &::placeholder { color: #9ca3af; }
    }
    .filter-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px;
      background: transparent; border: 1px solid #e5e7eb;
      font-size: 13px; font-weight: 500; color: #6b7280;
      cursor: pointer; transition: all 0.15s;
      &:hover { background: #f3f4f6; color: #0d1117; }
    }

    .table-card {
      background: #fff; border: 1px solid #e5e7eb;
      border-radius: 14px; overflow: hidden;
    }
    .data-table {
      width: 100%; border-collapse: collapse;
      th {
        padding: 12px 20px; text-align: left;
        font-size: 11px; font-weight: 700; color: #9ca3af;
        text-transform: uppercase; letter-spacing: 0.8px;
        border-bottom: 1px solid #f0f0f0;
        background: #fff;
      }
      td {
        padding: 14px 20px; border-bottom: 1px solid #f9fafb;
        font-size: 13px; color: #0d1117; vertical-align: middle;
      }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #fafafa; }
    }

    .cust-cell { display: flex; align-items: center; gap: 12px; }
    .cust-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
      &.lg { width: 48px; height: 48px; font-size: 16px; }
    }
    .cust-name  { font-size: 14px; font-weight: 600; color: #0d1117; }
    .cust-email { font-size: 12px; color: #9ca3af; }

    .status-badge {
      display: inline-block; padding: 3px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 600;
      &.badge-success { background: #dcfce7; color: #16a34a; }
      &.badge-warning { background: #fef3c7; color: #d97706; }
      &.badge-danger  { background: #fee2e2; color: #dc2626; }
      &.badge-review  { background: #dbeafe; color: #2563eb; }
    }
    .kyc-badge {
      display: inline-block; padding: 3px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 600;
      &.kyc-verified { background: transparent; color: #16a34a; }
      &.kyc-pending  { background: transparent; color: #d97706; }
      &.kyc-review   { background: transparent; color: #2563eb; }
    }

    .balance-cell { font-weight: 700; white-space: nowrap; }
    .center-cell  { text-align: center; color: #6b7280; }
    .date-cell    { color: #9ca3af; white-space: nowrap; }

    .more-btn {
      width: 32px; height: 32px; border-radius: 8px;
      border: none; background: transparent;
      display: flex; align-items: center; justify-content: center;
      color: #9ca3af; cursor: pointer; transition: all 0.15s;
      &:hover { background: #f3f4f6; color: #6b7280; }
    }

    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 60px 20px; color: #9ca3af; font-size: 14px;
    }
    .btn-ghost {
      background: transparent; border: none; color: #3b82f6;
      font-size: 14px; font-weight: 600; cursor: pointer;
      padding: 8px 16px; border-radius: 8px;
      &:hover { background: #dbeafe; }
    }

    .pagination {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 20px; border-top: 1px solid #f0f0f0;
    }
    .page-info { font-size: 13px; color: #6b7280; }
    .page-btns { display: flex; gap: 4px; }
    .page-btn {
      width: 34px; height: 34px; border-radius: 8px;
      background: transparent; border: 1px solid #e5e7eb;
      color: #6b7280; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
      &:hover:not(:disabled) { background: #f3f4f6; color: #0d1117; }
      &.active { background: #1e3a6e; border-color: #1e3a6e; color: #fff; }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; backdrop-filter: blur(4px);
    }
    .modal {
      background: #fff; border-radius: 16px; border: 1px solid #e5e7eb;
      width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 22px 22px 16px; border-bottom: 1px solid #f0f0f0; gap: 16px;
    }
    .modal-title { font-size: 18px; font-weight: 800; color: #0d1117; }
    .modal-sub   { font-size: 13px; color: #9ca3af; margin-top: 3px; }
    .modal-close {
      width: 30px; height: 30px; border-radius: 8px;
      background: #f3f4f6; border: none; color: #6b7280;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      &:hover { background: #e5e7eb; }
    }
    .modal-form { padding: 18px 22px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
    .form-group {
      display: flex; flex-direction: column; gap: 5px;
      label { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
      input {
        height: 40px; padding: 0 12px;
        background: #f9fafb; border: 1px solid #e5e7eb;
        border-radius: 8px; color: #0d1117; font-size: 13px;
        transition: border-color 0.15s;
        &:focus { border-color: #3b82f6; outline: none; background: #fff; }
        &::placeholder { color: #9ca3af; }
      }
    }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 10px;
      padding: 14px 22px; border-top: 1px solid #f0f0f0;
    }
    .btn-secondary {
      padding: 9px 18px; border-radius: 8px;
      background: #fff; color: #0d1117;
      font-size: 13px; font-weight: 600; cursor: pointer;
      border: 1px solid #e5e7eb; transition: background 0.15s;
      &:hover { background: #f3f4f6; }
    }
    .btn-danger {
      padding: 9px 18px; border-radius: 8px;
      background: #fee2e2; color: #dc2626;
      font-size: 13px; font-weight: 600; cursor: pointer;
      border: none; transition: all 0.15s;
      &:hover { background: #dc2626; color: #fff; }
    }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; padding: 8px 0; }
    .detail-item {
      display: flex; flex-direction: column; gap: 4px;
      padding: 12px 22px; border-bottom: 1px solid #f9fafb;
    }
    .detail-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 14px; font-weight: 600; color: #0d1117; }
  `],
})
export class CustomersComponent implements OnInit {
  private data = inject(DataService);
  private http = inject(HttpClient);

  allCustomers: Customer[] = [];
  searchQuery = '';
  currentPage = signal(1);
  pageSize = 8;
  showRegister = signal(false);
  showPending = signal(false);
  registerLoading = signal(false);
  selectedCustomer = signal<Customer | null>(null);
  registrationSuccessUser = signal<Customer | null>(null);
  pendingAccounts = signal<any[]>([]);

  reg = { 
    fullName: '', email: '', phone: '', nationalId: '',
    accountTypes: { CHECKING: false, SAVINGS: false, BUSINESS: false }
  };

  avatarColors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];

  ngOnInit() { 
    this.fetchRealUsers(); 
  }

  fetchRealUsers() {
    this.data.getCustomers().subscribe({
      next: (users: any[]) => {
        this.allCustomers = users.map(u => this.mapUserToCustomer(u));
      },
      error: (err: any) => {
        console.error('Failed to fetch real users', err);
        // Fallback to empty or notify user
        this.allCustomers = [];
      }
    });
  }

  mapUserToCustomer(u: any): Customer {
    const initials = u.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    return {
      id: u.id,
      initials,
      name: u.fullName,
      email: u.email || 'N/A',
      phone: u.phoneNumber,
      nationalId: u.nationalId || 'N/A',
      status: 'Active', // Default status for listed customers
      balance: 0, // In a real app, this would be summed from accounts
      accounts: 1,
      cards: 0,
      joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      joinedAgo: 'Member',
      qrCodeBase64: u.qrCodeBase64,
      qrTokenHash: u.qrTokenHash
    };
  }

  filtered = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return this.allCustomers.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  });

  paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  pageStart  = computed(() => Math.min((this.currentPage() - 1) * this.pageSize + 1, this.filtered().length));
  pageEnd    = computed(() => Math.min(this.currentPage() * this.pageSize, this.filtered().length));
  pageNumbers = computed(() => {
    const total = this.totalPages(), cur = this.currentPage();
    const start = Math.max(1, cur - 2), end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
  trackById(_: number, c: Customer) { return c.id; }

  statusClass(s: string) {
    return { 'Active': 'badge-success', 'Pending': 'badge-warning', 'Frozen': 'badge-danger', 'Under Review': 'badge-review' }[s] || '';
  }

  kycLabel(s: string) {
    return s === 'Active' ? 'Verified' : s === 'Pending' ? 'Pending' : 'Under Review';
  }

  kycClass(s: string) {
    return s === 'Active' ? 'kyc-verified' : s === 'Pending' ? 'kyc-pending' : 'kyc-review';
  }

  avatarBg(initials: string): string {
    const i = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % this.avatarColors.length;
    return this.avatarColors[i];
  }

  fmtBalance(n: number): string {
    return n.toLocaleString('fr-FR').replace(/\s/g, '\u00a0') + ' XAF';
  }

  viewCustomer(c: Customer) { this.selectedCustomer.set(c); }

  toggleFreeze(c: Customer) { c.status = c.status === 'Frozen' ? 'Active' : 'Frozen'; }

  closeRegister() {
    this.showRegister.set(false);
    this.reg = { 
      fullName: '', email: '', phone: '', nationalId: '',
      accountTypes: { CHECKING: false, SAVINGS: false, BUSINESS: false }
    };
  }

  loadPendingAccounts() {
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any[]>('http://localhost:8085/api/accounts/admin/pending-accounts', { headers }).subscribe({
      next: (res: any[]) => {
        this.pendingAccounts.set(res);
        this.showPending.set(true);
      },
      error: (err: any) => alert('Failed to load pending accounts')
    });
  }

  approveAccount(accountId: number) {
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.patch(`http://localhost:8085/api/accounts/admin/approve-account/${accountId}`, {}, { headers }).subscribe({
      next: () => {
        alert('Account approved successfully!');
        this.loadPendingAccounts();
      },
      error: () => alert('Failed to approve account')
    });
  }

  submitRegister() {
    if (!this.reg.fullName || !this.reg.phone) return;
    this.registerLoading.set(true);

    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    const selectedTypes = Object.entries(this.reg.accountTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);

    this.http.post<any>('http://localhost:8085/api/accounts/admin/register-customer', {
      fullName: this.reg.fullName,
      phoneNumber: this.reg.phone,
      accountTypes: selectedTypes.length > 0 ? selectedTypes : ['SAVINGS']
    }, { headers }).subscribe({
      next: (res: any) => {
        const newCustomer = this.mapUserToCustomer(res);
        this.allCustomers = [newCustomer, ...this.allCustomers];
        this.registerLoading.set(false);
        this.closeRegister();
        this.registrationSuccessUser.set(newCustomer);
      },
      error: (err: any) => {
        console.error('Registration failed', err);
        alert('Failed to register customer. Check console for details.');
        this.registerLoading.set(false);
      }
    });
  }

  customerDetails(c: Customer) {
    return [
      { label: 'Full Name',   value: c.name },
      { label: 'Email',       value: c.email },
      { label: 'Phone',       value: c.phone },
      { label: 'National ID', value: c.nationalId },
      { label: 'Status',      value: c.status, isStatus: true },
      { label: 'Balance',     value: this.fmtBalance(c.balance) },
      { label: 'Accounts',    value: String(c.accounts) },
      { label: 'Cards',       value: String(c.cards) },
      { label: 'Joined',      value: c.joined },
    ];
  }
}
