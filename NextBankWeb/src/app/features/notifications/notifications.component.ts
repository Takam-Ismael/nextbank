import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, AdminNotification } from '../../core/services/notification.service';

@Component({
  selector: 'nb-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  private svc = inject(NotificationService);

  notifications = signal<AdminNotification[]>([]);
  loading       = signal(true);
  error         = signal('');
  searchQuery   = signal('');
  activeType    = signal('');
  currentPage   = signal(1);
  pageSize      = 15;

  readonly typeFilters = [
    { val: '',                    label: 'All' },
    { val: 'WELCOME',             label: 'Welcome' },
    { val: 'DEPOSIT_COMPLETED',   label: 'Deposits' },
    { val: 'TRANSFER_SENT',       label: 'Transfers' },
    { val: 'WITHDRAWAL_PROCESSED',label: 'Withdrawals' },
    { val: 'CARD_CREATED',        label: 'Cards' },
    { val: 'ACCOUNT_FROZEN',      label: 'Account Events' },
  ];

  readonly typeIcon: Record<string, { icon: string; color: string; bg: string }> = {
    WELCOME:              { icon: '🏦', color: '#8b5cf6', bg: '#ede9fe' },
    ACCOUNT_FROZEN:       { icon: '🔒', color: '#ef4444', bg: '#fee2e2' },
    ACCOUNT_UNFROZEN:     { icon: '🔓', color: '#22c55e', bg: '#dcfce7' },
    DEPOSIT_PENDING:      { icon: '⏳', color: '#f59e0b', bg: '#fef3c7' },
    DEPOSIT_COMPLETED:    { icon: '💰', color: '#22c55e', bg: '#dcfce7' },
    DEPOSIT_FAILED:       { icon: '❌', color: '#ef4444', bg: '#fee2e2' },
    TRANSFER_SENT:        { icon: '↗️', color: '#ef4444', bg: '#fee2e2' },
    TRANSFER_RECEIVED:    { icon: '↙️', color: '#22c55e', bg: '#dcfce7' },
    WITHDRAWAL_PROCESSED: { icon: '📱', color: '#f59e0b', bg: '#fef3c7' },
    CARD_CREATED:         { icon: '💳', color: '#3b82f6', bg: '#dbeafe' },
    CARD_FROZEN:          { icon: '🧊', color: '#ef4444', bg: '#fee2e2' },
    CARD_UNFROZEN:        { icon: '✅', color: '#22c55e', bg: '#dcfce7' },
  };

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.svc.getAllNotifications(0, 200).subscribe({
      next: (res) => {
        const list: AdminNotification[] = res?.content ?? (Array.isArray(res) ? res : []);
        this.notifications.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load notifications. Is the notifications service running on port 8087?');
        this.loading.set(false);
      }
    });
  }

  filtered = computed(() => {
    const q  = this.searchQuery().toLowerCase();
    const ty = this.activeType();
    return this.notifications().filter(n => {
      const matchQ  = !q  || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      const matchTy = !ty || n.type === ty || (ty === 'ACCOUNT_FROZEN' && (n.type === 'ACCOUNT_FROZEN' || n.type === 'ACCOUNT_UNFROZEN'));
      return matchQ && matchTy;
    });
  });

  paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  totalPages  = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  pageStart   = computed(() => Math.min((this.currentPage() - 1) * this.pageSize + 1, this.filtered().length));
  pageEnd     = computed(() => Math.min(this.currentPage() * this.pageSize, this.filtered().length));
  pageNumbers = computed(() => {
    const total = this.totalPages(), cur = this.currentPage();
    const start = Math.max(1, cur - 2), end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  getIcon(type: string) { return this.typeIcon[type] ?? { icon: '🔔', color: '#6b7280', bg: '#f3f4f6' }; }

  fmtTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1)   return 'Just now';
    if (diff < 60)  return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  trackById(_: number, n: AdminNotification) { return n.id; }

  markAsRead(n: AdminNotification) {
    if (n.isRead) return;
    this.svc.markAsRead(n.id).subscribe({
      next: () => {
        n.isRead = true;
        this.notifications.set([...this.notifications()]);
        this.svc.unreadUpdated$.next();
      }
    });
  }
}
