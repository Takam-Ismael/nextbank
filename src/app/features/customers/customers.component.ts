import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
        <button class="btn-add" (click)="showRegister.set(true)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
          </svg>
          Add Customer
        </button>
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
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 12px; padding: 12px 16px;
    }
    .search-wrap {
      display: flex; align-items: center; gap: 8px;
      flex: 1; max-width: 320px;
      background: var(--bg-input); border: 1px solid var(--border);
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
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 14px; overflow: hidden;
    }
    .data-table {
      width: 100%; border-collapse: collapse;
      th {
        padding: 14px 20px; text-align: left;
        font-size: 11px; font-weight: 700; color: #64748b;
        text-transform: uppercase; letter-spacing: 1px;
        border-bottom: 2px solid #f1f5f9;
        background: #f8fafc;
      }
      td {
        padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
        font-size: 13px; color: var(--text-primary); vertical-align: middle;
      }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #f1f5f9; }
    }

    .cust-cell { display: flex; align-items: center; gap: 12px; }
    .cust-avatar {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      &.lg { width: 56px; height: 56px; font-size: 18px; border-radius: 14px; }
    }
    .cust-name  { font-size: 14px; font-weight: 600; color: #0f172a; }
    .cust-email { font-size: 12px; color: #64748b; }

    .status-badge {
      display: inline-block; padding: 4px 12px; border-radius: 6px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
      &.badge-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
      &.badge-warning { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
      &.badge-danger  { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
      &.badge-review  { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
    }
    .kyc-badge {
      display: inline-block; padding: 3px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 600;
      &.kyc-verified { background: transparent; color: #059669; }
      &.kyc-pending  { background: transparent; color: #d97706; }
      &.kyc-review   { background: transparent; color: #2563eb; }
    }

    .balance-cell { font-weight: 700; color: var(--text-primary); white-space: nowrap; }
    .center-cell  { text-align: center; color: #64748b; font-weight: 500; }
    .date-cell    { color: #64748b; white-space: nowrap; }

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

    /* Dark mode overrides */
    :host-context([data-theme="dark"]) .filters-bar { background: var(--bg-card); border-color: var(--border); }
    :host-context([data-theme="dark"]) .search-wrap { background: var(--bg-input); border-color: var(--border); }
    :host-context([data-theme="dark"]) .search-input { color: var(--text-primary); }
    :host-context([data-theme="dark"]) .filter-btn { border-color: var(--border); color: var(--text-secondary); }
    :host-context([data-theme="dark"]) .filter-btn:hover { background: var(--bg-card-alt); color: var(--text-primary); }
    :host-context([data-theme="dark"]) .table-card { background: var(--bg-card); border-color: var(--border); }
    :host-context([data-theme="dark"]) .data-table th { background: var(--bg-card); border-color: var(--border); color: var(--text-tertiary); }
    :host-context([data-theme="dark"]) .data-table td { border-color: var(--border-light); color: var(--text-primary); }
    :host-context([data-theme="dark"]) .data-table tr:hover td { background: var(--bg-card-alt); }
    :host-context([data-theme="dark"]) .cust-name { color: var(--text-primary); }
    :host-context([data-theme="dark"]) .pagination { border-color: var(--border); }
    :host-context([data-theme="dark"]) .page-btn { border-color: var(--border); color: var(--text-secondary); }
    :host-context([data-theme="dark"]) .page-btn:hover:not(:disabled) { background: var(--bg-card-alt); color: var(--text-primary); }
    :host-context([data-theme="dark"]) .page-info { color: var(--text-secondary); }
    :host-context([data-theme="dark"]) .status-badge.badge-success { background: rgba(16,185,129,0.15); color: #34d399; }
    :host-context([data-theme="dark"]) .status-badge.badge-warning { background: rgba(217,119,6,0.15);  color: #fbbf24; }
    :host-context([data-theme="dark"]) .status-badge.badge-danger  { background: rgba(220,38,38,0.15);  color: #f87171; }
    :host-context([data-theme="dark"]) .status-badge.badge-review  { background: rgba(37,99,235,0.15);  color: #60a5fa; }
    :host-context([data-theme="dark"]) .modal { background: var(--bg-card); border-color: var(--border); }
    :host-context([data-theme="dark"]) .modal-header, [data-theme="dark"] .modal-footer { border-color: var(--border); }
    :host-context([data-theme="dark"]) .modal-title, [data-theme="dark"] .detail-value { color: var(--text-primary); }
    :host-context([data-theme="dark"]) .form-group input { background: var(--bg-input); border-color: var(--border); color: var(--text-primary); }
    :host-context([data-theme="dark"]) .detail-item { border-color: var(--border-light); }
    :host-context([data-theme="dark"]) .btn-secondary { background: var(--bg-card); border-color: var(--border); color: var(--text-primary); }
    :host-context([data-theme="dark"]) .modal-close { background: var(--bg-card-alt); color: var(--text-secondary); }
  `],
})
export class CustomersComponent implements OnInit {
  private data = inject(DataService);

  allCustomers: Customer[] = [];
  searchQuery = '';
  currentPage = signal(1);
  pageSize = 8;
  showRegister = signal(false);
  registerLoading = signal(false);
  selectedCustomer = signal<Customer | null>(null);

  reg = { fullName: '', email: '', phone: '', nationalId: '' };

  avatarColors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];

  ngOnInit() { this.allCustomers = this.data.getRecentCustomers(); }

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
    this.reg = { fullName: '', email: '', phone: '', nationalId: '' };
  }

  submitRegister() {
    if (!this.reg.fullName || !this.reg.email) return;
    this.registerLoading.set(true);
    setTimeout(() => {
      const initials = this.reg.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      this.allCustomers = [{
        id: this.allCustomers.length + 1, initials,
        name: this.reg.fullName, email: this.reg.email,
        phone: this.reg.phone, nationalId: this.reg.nationalId,
        status: 'Active', balance: 0, accounts: 1, cards: 0,
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        joinedAgo: 'Just now',
      }, ...this.allCustomers];
      this.registerLoading.set(false);
      this.closeRegister();
    }, 1200);
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
