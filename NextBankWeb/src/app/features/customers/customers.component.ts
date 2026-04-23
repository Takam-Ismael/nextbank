import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService, Customer } from '../../core/services/data.service';
import { environment } from '../../../environments/environment';

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

      <!-- STATUS TABS -->
      <div class="status-tabs" style="display: flex; gap: 8px; margin-bottom: 5px;">
        <button *ngFor="let s of ['All', 'Pending', 'Active', 'Frozen']" 
                class="status-tab" 
                [class.active]="statusFilter() === s"
                (click)="statusFilter.set(s)">
          {{ s }}
          <span class="tab-count" *ngIf="s === 'All'">{{ allCustomers().length }}</span>
          <span class="tab-count" *ngIf="s !== 'All'">{{ countByStatus(s) }}</span>
        </button>
      </div>

      <!-- TABLE CARD -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 250px;">CUSTOMER</th>
              <th style="width: 130px;">STATUS</th>
              <th style="width: 120px;">KYC</th>
              <th style="width: 100px; text-align: center;">ACCOUNTS</th>
              <th style="width: 140px; text-align: right;">BALANCE</th>
              <th style="width: 140px;">JOINED</th>
              <th style="width: 100px;"></th>
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
              <td style="display: flex; gap: 8px; align-items: center;">
                <button class="more-btn" (click)="viewCustomer(c)" title="View Details">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <button *ngIf="c.status === 'Pending'" class="approve-btn" (click)="approveUser(c)" title="Approve User">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
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

          <!-- ACCOUNTS LIST -->
          <div class="accounts-section" style="padding: 0 22px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="detail-label">Linked Accounts</span>
              <button *ngIf="hasPending(selectedCustomer()!)" 
                      class="btn-ghost" 
                      style="font-size: 11px; padding: 4px 10px; height: auto;" 
                      (click)="approveAll(selectedCustomer()!)">
                Approve All
              </button>
            </div>
            <div class="accounts-list" style="display: flex; flex-direction: column; gap: 10px;">
              <div *ngFor="let acc of (selectedCustomer()?.rawAccounts || [])" 
                   style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border);">
                <div>
                  <div style="font-size: 13px; font-weight: 700; color: var(--text-primary);">{{ acc.type }}</div>
                  <div style="font-size: 11px; color: var(--text-tertiary); font-family: 'JetBrains Mono', monospace;">{{ acc.accountNumber }}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 14px; font-weight: 800; color: var(--success);">{{ fmtBalance(acc.balance) }}</div>
                  <div *ngIf="acc.status === 'PENDING'" style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; margin-top: 6px;">
                    <span style="font-size: 10px; font-weight: 800; color: var(--warning);">PENDING</span>
                    <button class="btn-add" style="padding: 4px 10px; font-size: 11px; border-radius: 6px;" (click)="approveAccount(acc.id)">Approve</button>
                  </div>
                  <div *ngIf="acc.status !== 'PENDING'" style="font-size: 10px; font-weight: 800;" [style.color]="acc.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)'">
                    {{ acc.status }}
                  </div>
                </div>
              </div>
              <div *ngIf="(selectedCustomer()?.rawAccounts || []).length === 0" style="font-size: 12px; color: #9ca3af; text-align: center; padding: 10px;">
                No accounts found.
              </div>
            </div>
          </div>
          
          <div *ngIf="selectedCustomer()?.qrCodeBase64" style="padding: 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; background: var(--bg-card-alt); border-radius: 0 0 20px 20px;">
            <span class="detail-label" style="margin-bottom: 12px; font-weight: 700; color: var(--text-secondary);">SECURITY QR CODE</span>
            <div style="background: white; padding: 12px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); border: 1px solid var(--border); margin-bottom: 16px;">
              <img [src]="'data:image/png;base64,' + selectedCustomer()!.qrCodeBase64" 
                   alt="QR Code" 
                   style="width: 160px; height: 160px; display: block;"/>
            </div>
            <div style="display: flex; gap: 8px; width: 100%;">
              <button class="btn-ghost" 
                      style="flex: 1; font-size: 12px; font-weight: 700; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center;" 
                      (click)="downloadQR(selectedCustomer()!)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PNG
              </button>
            </div>
            <p style="margin-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-tertiary); background: var(--bg-input); padding: 4px 8px; border-radius: 6px;">
              ID: {{ selectedCustomer()?.qrTokenHash }}
            </p>
          </div>

          <div class="modal-footer">
            <div style="flex: 1; display: flex; gap: 10px;">
              <button class="btn-secondary" (click)="startEdit(selectedCustomer()!)" style="background: var(--bg-card); color: var(--accent); border: 1px solid var(--border);">
                Edit Profile
              </button>
              <button class="btn-danger" (click)="confirmDelete(selectedCustomer()!)">
                Delete
              </button>
            </div>
            <button class="btn-secondary" (click)="selectedCustomer.set(null)" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border);">Close</button>
          </div>
        </div>
      </div>

      <!-- EDIT MODAL -->
      <div class="modal-backdrop" *ngIf="showEdit()" (click)="showEdit.set(false)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Edit Customer</h2>
              <p class="modal-sub">Update profile information for {{ editData.fullName }}</p>
            </div>
            <button class="modal-close" (click)="showEdit.set(false)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <form class="modal-form" (ngSubmit)="saveEdit()">
            <div class="form-grid">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" [(ngModel)]="editData.fullName" name="editName"/>
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="editData.email" name="editEmail"/>
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" [(ngModel)]="editData.phone" name="editPhone"/>
              </div>
              <div class="form-group">
                <label>National ID</label>
                <input type="text" [(ngModel)]="editData.nationalId" name="editNationalId"/>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="editData.status" name="editStatus" style="height: 40px; padding: 0 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Frozen">Frozen</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="showEdit.set(false)">Cancel</button>
              <button type="submit" class="btn-add" [disabled]="registerLoading()">
                {{ registerLoading() ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .customers-page { display: flex; flex-direction: column; gap: 20px; }

    .modal {
      width: 100%; max-width: 580px; background: var(--bg-card);
      border-radius: 20px; box-shadow: var(--shadow-lg);
      position: relative; max-height: 90vh; overflow-y: auto;
      animation: modalSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid var(--border);
    }
    .modal-header {
      padding: 24px 28px; border-bottom: 1px solid var(--border-light);
      display: flex; justify-content: space-between; align-items: flex-start;
    }
    .modal-title { font-size: 20px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
    .modal-sub { font-size: 13px; color: var(--text-tertiary); font-weight: 500; }
    
    .modal-close {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--bg-page); color: var(--text-secondary);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
      &:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }
    }

    .btn-add {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 10px;
      background: var(--accent); color: #fff;
      font-size: 14px; font-weight: 600; cursor: pointer;
      border: none; transition: background 0.15s;
      &:hover { background: var(--accent-hover); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .filters-bar {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 12px; padding: 12px 16px;
    }
    .search-wrap {
      flex: 1; position: relative; display: flex; align-items: center;
      background: var(--bg-input); border-radius: 8px; padding: 0 12px;
      svg { color: var(--text-secondary); margin-right: 8px; }
    }
    .search-input {
      flex: 1; height: 38px; border: none; background: transparent;
      font-size: 13.5px; color: var(--text-primary);
      &::placeholder { color: var(--text-tertiary); }
    }
    .filter-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 0 14px; height: 38px; border-radius: 8px;
      background: var(--bg-card); border: 1px solid var(--border);
      color: var(--text-secondary); font-size: 13px; font-weight: 600;
      transition: all 0.2s;
      &:hover { background: var(--bg-page); color: var(--text-primary); }
    }

    .table-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 14px; overflow: hidden;
    }
    .data-table {
      width: 100%; border-collapse: collapse;
      th {
        background: var(--bg-card-alt); padding: 14px 20px;
        text-align: left; font-size: 11px; font-weight: 800;
        color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;
        border-bottom: 1px solid var(--border);
      }
      td {
        padding: 16px 20px; border-bottom: 1px solid var(--border-light);
        vertical-align: middle;
      }
    }

    .cust-cell { display: flex; align-items: center; gap: 12px; }
    .cust-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
      &.lg { width: 48px; height: 48px; font-size: 16px; }
    }
    .name-text { display: block; font-size: 14px; font-weight: 700; color: var(--text-primary); }
    .email-text { display: block; font-size: 12px; color: var(--text-tertiary); }
    
    .status-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 600;
      &.badge-success { background: var(--success-light); color: var(--success); }
      &.badge-warning { background: var(--warning-light); color: var(--warning); }
      &.badge-danger  { background: var(--danger-light);  color: var(--danger);  }
      &.badge-review  { background: var(--accent-light);  color: var(--accent);  }
      .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    }
    .kyc-badge {
      display: inline-block; padding: 4px 12px; border-radius: 20px;
      font-size: 11px; font-weight: 700;
      &.kyc-verified { background: var(--success-light); color: var(--success); }
      &.kyc-pending  { background: var(--warning-light); color: var(--warning); }
      &.kyc-review   { background: var(--accent-light);  color: var(--accent); }
    }

    .balance-cell { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--text-primary); font-size: 13px; }
    .date-cell { font-size: 13px; font-weight: 600; color: var(--text-secondary); }

    .more-btn, .approve-btn {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-tertiary); transition: all 0.2s;
      background: transparent;
      &:hover { background: var(--bg-page); color: var(--text-primary); }
    }
    .approve-btn:hover { background: var(--bg-success); color: var(--text-success); }

    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 60px 20px; color: var(--text-tertiary); font-size: 14px;
    }
    .btn-ghost {
      background: transparent; border: none; color: var(--accent);
      font-size: 14px; font-weight: 600; cursor: pointer;
      padding: 8px 16px; border-radius: 8px;
      &:hover { background: var(--bg-accent-light); }
    }

    .pagination {
      padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;
      background: var(--bg-card-alt); border-top: 1px solid var(--border);
    }
    .page-info { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
    .page-nav { display: flex; gap: 6px; }
    .page-btn {
      width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg-card); color: var(--text-primary); font-weight: 600;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
      &:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
      &.active { background: var(--sidebar-active); border-color: var(--sidebar-active); color: #fff; }
    }

    .modal-backdrop {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; backdrop-filter: blur(4px);
    }
    .modal-form { padding: 24px 28px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .form-group {
      label { display: block; font-size: 11px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
      input {
        width: 100%; height: 42px; background: var(--bg-input); border: 1px solid var(--border-light);
        border-radius: 10px; padding: 0 14px; font-size: 14px; color: var(--text-primary); font-weight: 600;
        transition: all 0.2s;
        &:focus { border-color: var(--accent); background: var(--bg-card); box-shadow: 0 0 0 4px var(--accent-light); }
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
      padding: 12px 22px; border-bottom: 1px solid var(--border-light);
    }
    .detail-label { font-size: 11px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }

    .status-tabs { margin-top: 10px; }
    .status-tab {
      padding: 6px 14px; border-radius: 20px; border: 1px solid transparent;
      background: transparent; color: #6b7280; font-size: 13px; font-weight: 600;
      cursor: pointer; display: flex; align-items: center; gap: 6px;
      transition: all 0.2s;
      &:hover { background: #f3f4f6; color: #0d1117; }
      &.active { background: #1e3a6e; color: #fff; }
    }
    .tab-count {
      font-size: 10px; padding: 2px 6px; border-radius: 10px;
      background: rgba(0,0,0,0.1); color: inherit;
    }
    :host-context(.active) .tab-count { background: rgba(255,255,255,0.2); }
  `],
})
export class CustomersComponent implements OnInit {
  private data = inject(DataService);
  private http = inject(HttpClient);

  allCustomers = signal<Customer[]>([]);
  searchQuery = '';
  currentPage = signal(1);
  pageSize = 8;
  statusFilter = signal<string>('All');
  showRegister = signal(false);
  showPending = signal(false);
  registerLoading = signal(false);
  selectedCustomer = signal<Customer | null>(null);
  showEdit = signal(false);
  registrationSuccessUser = signal<Customer | null>(null);
  pendingAccounts = signal<any[]>([]);

  reg = { 
    fullName: '', email: '', phone: '', nationalId: '',
    accountTypes: { CHECKING: false, SAVINGS: false, BUSINESS: false }
  };

  editData = {
    id: 0, fullName: '', email: '', phone: '', nationalId: '', status: ''
  };

  avatarColors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];

  ngOnInit() { 
    this.fetchRealUsers(); 
  }

  fetchRealUsers() {
    this.data.getCustomers().subscribe({
      next: (users: any[]) => {
        this.allCustomers.set(users.map(u => this.mapUserToCustomer(u)));
      },
      error: (err: any) => {
        console.error('Failed to fetch real users', err);
        // Fallback to empty or notify user
        this.allCustomers.set([]);
      }
    });
  }

  mapUserToCustomer(u: any): Customer {
    const accounts = u.accounts || [];
    const totalBalance = accounts.reduce((acc: number, curr: any) => acc + (curr.balance || 0), 0);
    const initials = u.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    
    return {
      id: u.id,
      initials,
      name: u.fullName,
      email: u.email || 'N/A',
      phone: u.phoneNumber,
      nationalId: u.nationalId || 'N/A',
      status: u.status || 'Active', 
      balance: totalBalance,
      accounts: accounts.length,
      cards: 0,
      joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      joinedAgo: 'Member',
      qrCodeBase64: u.qrCodeBase64,
      qrTokenHash: u.qrTokenHash,
      rawAccounts: accounts
    };
  }

  filtered = computed(() => {
    const q = this.searchQuery.toLowerCase();
    const status = this.statusFilter();
    return this.allCustomers().filter(c => {
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesStatus = status === 'All' || c.status === status;
      return matchesSearch && matchesStatus;
    });
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

  countByStatus(status: string) {
    return this.allCustomers().filter(c => c.status === status).length;
  }

  avatarBg(initials: string): string {
    const i = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % this.avatarColors.length;
    return this.avatarColors[i];
  }

  fmtBalance(n: number): string {
    return n.toLocaleString('fr-FR').replace(/\s/g, '\u00a0') + ' XAF';
  }

  viewCustomer(c: Customer) { this.selectedCustomer.set(c); }

  downloadQR(c: Customer) {
    if (!c.qrCodeBase64) return;
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + c.qrCodeBase64;
    link.download = `QR_${c.name.replace(/\s+/g, '_')}.png`;
    link.click();
  }

  startEdit(c: Customer) {
    this.editData = {
      id: c.id,
      fullName: c.name,
      email: c.email === 'N/A' ? '' : c.email,
      phone: c.phone,
      nationalId: c.nationalId === 'N/A' ? '' : c.nationalId,
      status: c.status
    };
    this.selectedCustomer.set(null);
    this.showEdit.set(true);
  }

  saveEdit() {
    this.registerLoading.set(true);
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.put<any>(`${environment.apiUrl}/api/accounts/admin/customers/${this.editData.id}`, {
      fullName: this.editData.fullName,
      email: this.editData.email,
      phoneNumber: this.editData.phone,
      nationalId: this.editData.nationalId,
      status: this.editData.status
    }, { headers }).subscribe({
      next: (res: any) => {
        const updated = this.mapUserToCustomer(res);
        this.allCustomers.update(prev => prev.map(c => c.id === updated.id ? updated : c));
        this.registerLoading.set(false);
        this.showEdit.set(false);
      },
      error: () => {
        alert('Failed to update customer');
        this.registerLoading.set(false);
      }
    });
  }

  confirmDelete(c: Customer) {
    if (!confirm(`Are you sure you want to delete customer ${c.name}? This will also delete all linked accounts.`)) return;
    
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete(`${environment.apiUrl}/api/accounts/admin/customers/${c.id}`, { headers }).subscribe({
      next: () => {
        this.allCustomers.update(prev => prev.filter(cust => cust.id !== c.id));
        this.selectedCustomer.set(null);
        alert('Customer deleted successfully');
      },
      error: () => alert('Failed to delete customer')
    });
  }

  toggleFreeze(c: Customer) { c.status = c.status === 'Frozen' ? 'Active' : 'Frozen'; }

  closeRegister() {
    this.showRegister.set(false);
    this.reg = { 
      fullName: '', email: '', phone: '', nationalId: '',
      accountTypes: { CHECKING: false, SAVINGS: false, BUSINESS: false }
    };
  }


  hasPending(c: Customer): boolean {
    return (c.rawAccounts || []).some(a => a.status === 'PENDING');
  }

  approveAll(c: Customer) {
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.patch(`${environment.apiUrl}/api/accounts/admin/approve-all/${c.id}`, {}, { headers }).subscribe({
      next: () => {
        // Update all accounts to ACTIVE locally
        this.allCustomers.update(prev => prev.map(cust => {
          if (cust.id === c.id) {
             const updatedAccounts = (cust.rawAccounts || []).map(a => ({ ...a, status: 'ACTIVE' }));
             return { ...cust, rawAccounts: updatedAccounts };
          }
          return cust;
        }));
        // Update modal UI
        const current = this.selectedCustomer();
        if (current) {
          const updatedAccs = (current.rawAccounts || []).map(a => ({ ...a, status: 'ACTIVE' }));
          this.selectedCustomer.set({ ...current, rawAccounts: updatedAccs });
        }
      },
      error: () => alert('Failed to approve all accounts')
    });
  }

  approveUser(c: Customer) {
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.patch<any>(`${environment.apiUrl}/api/accounts/admin/approve-user/${c.id}`, {}, { headers }).subscribe({
      next: (res: any) => {
        const updated = this.mapUserToCustomer(res);
        this.allCustomers.update(prev => prev.map(cust => cust.id === updated.id ? updated : cust));
      },
      error: () => alert('Failed to approve user')
    });
  }

  approveAccount(accountId: number) {
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.patch(`${environment.apiUrl}/api/accounts/admin/approve-account/${accountId}`, {}, { headers }).subscribe({
      next: (res: any) => {
        // Find the customer this account belongs to and update their accounts list
        const customerId = this.selectedCustomer()?.id;
        if (customerId) {
          this.allCustomers.update(prev => prev.map(c => {
            if (c.id === customerId) {
               const updatedAccounts = (c.rawAccounts || []).map(a => a.id === accountId ? res : a);
               return { ...c, rawAccounts: updatedAccounts };
            }
            return c;
          }));
          // Also update the selectedCustomer signal to refresh the modal UI
          const current = this.selectedCustomer();
          if (current) {
            const updatedAccs = (current.rawAccounts || []).map(a => a.id === accountId ? res : a);
            this.selectedCustomer.set({ ...current, rawAccounts: updatedAccs });
          }
        }
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

    this.http.post<any>(`${environment.apiUrl}/api/accounts/admin/register-customer`, {
      fullName: this.reg.fullName,
      phoneNumber: this.reg.phone,
      email: this.reg.email,
      nationalId: this.reg.nationalId,
      accountTypes: selectedTypes.length > 0 ? selectedTypes : ['SAVINGS']
    }, { headers }).subscribe({
      next: (res: any) => {
        const newCustomer = this.mapUserToCustomer(res);
        this.allCustomers.update(prev => [newCustomer, ...prev]);
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
