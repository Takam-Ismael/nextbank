import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplianceService } from '../../core/services/compliance.service';

@Component({
  selector: 'nb-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss'],
})
export class ComplianceComponent implements OnInit {
  private svc = inject(ComplianceService);

  pendingAccounts = signal<any[]>([]);
  allCustomers    = signal<any[]>([]);
  loading         = signal(true);
  error           = signal('');
  searchQuery     = '';
  processingId    = signal<number | null>(null);
  activeTab       = signal<'accounts' | 'customers'>('accounts');

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set('');

    // Load both pending accounts and all customers
    this.svc.getPendingAccounts().subscribe({
      next: (accounts) => {
        this.pendingAccounts.set(accounts ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load compliance data. Is the accounts service running?');
        this.loading.set(false);
      }
    });

    this.svc.getCustomers().subscribe({
      next: (customers) => {
        // Pending customers = status is not Active
        this.allCustomers.set((customers ?? []).filter((c: any) => c.status !== 'Active'));
      },
      error: () => {}
    });
  }

  filteredAccounts = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return this.pendingAccounts().filter(a =>
      !q || a.accountNumber?.toLowerCase().includes(q) || a.type?.toLowerCase().includes(q)
    );
  });

  filteredCustomers = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return this.allCustomers().filter(c =>
      !q || c.fullName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  });

  approveAccount(account: any) {
    this.processingId.set(account.id);
    this.svc.approveAccount(account.id).subscribe({
      next: () => {
        this.pendingAccounts.update(list => list.filter(a => a.id !== account.id));
        this.processingId.set(null);
      },
      error: () => this.processingId.set(null)
    });
  }

  approveUser(customer: any) {
    this.processingId.set(customer.id);
    this.svc.approveUser(customer.id).subscribe({
      next: () => {
        this.allCustomers.update(list => list.filter(c => c.id !== customer.id));
        this.processingId.set(null);
        // Also approve all their accounts
        this.svc.approveAllAccounts(customer.id).subscribe();
        // Reload pending accounts
        this.svc.getPendingAccounts().subscribe(a => this.pendingAccounts.set(a ?? []));
      },
      error: () => this.processingId.set(null)
    });
  }

  initials(name: string): string {
    return (name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  avatarBg(name: string): string {
    const colors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2'];
    const code = (name || 'U').charCodeAt(0) % colors.length;
    return colors[code];
  }
}
