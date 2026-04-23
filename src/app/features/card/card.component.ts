import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Customer } from '../../core/services/data.service';

@Component({
  selector: 'nb-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  private data = inject(DataService);

  viewMode = signal<'table' | 'grid'>('table');
  allCards: any[] = [];
  searchQuery = '';
  currentPage = signal(1);
  pageSize = 8;
  showIssue = signal(false);
  savingIssue = signal(false);
  selectedCard = signal<any | null>(null);

  issueForm = { customerName: '', email: '', accountNumber: '', accountType: 'CHECKING', cardType: 'VISA' };

  statusFilters = [
    { label: 'All Cards', val: '', color: '' },
    { label: 'Active', val: 'ACTIVE', color: '#10b981' },
    { label: 'Frozen', val: 'FROZEN', color: '#3b82f6' },
    { label: 'Expired', val: 'EXPIRED', color: '#9ca3af' },
  ];
  activeStatus = signal('');
  activeType = '';
  activeAccount = '';

  kpis = { total: 0, active: 0, frozen: 0, expired: 0 };

  ngOnInit() {
    this.loadMockCards();
    this.updateKPIs();
  }

  loadMockCards() {
    // Generate realistic card data from customers
    const customers = this.data.getRecentCustomers();
    this.allCards = customers.map(c => ({
      id: c.id,
      customerName: c.name,
      customerInitials: c.initials,
      customerEmail: c.email,
      cardNumber: this.generateCardNumber(c.id),
      cardType: c.id % 2 === 0 ? 'VISA' : 'MASTERCARD',
      accountType: c.id % 3 === 0 ? 'SAVINGS' : c.id % 5 === 0 ? 'BUSINESS' : 'CHECKING',
      accountNumber: `ACC-${1000 + c.id}-2024`,
      status: c.status === 'Active' ? 'ACTIVE' : c.status === 'Frozen' ? 'FROZEN' : 'EXPIRED',
      expiryMonth: '12',
      expiryYear: '26',
      issuedDate: c.joined,
      cardholderName: c.name.toUpperCase(),
      limit: 500000 + (c.id * 100000)
    }));
  }

  private generateCardNumber(id: number): string {
    const last4 = (1000 + id).toString();
    return `4242 **** **** ${last4}`;
  }

  updateKPIs() {
    this.kpis = {
      total: this.allCards.length,
      active: this.allCards.filter(c => c.status === 'ACTIVE').length,
      frozen: this.allCards.filter(c => c.status === 'FROZEN').length,
      expired: this.allCards.filter(c => c.status === 'EXPIRED').length,
    };
  }

  filtered = computed(() => {
    const q = this.searchQuery.toLowerCase();
    const s = this.activeStatus();
    const t = this.activeType;
    const a = this.activeAccount;

    return this.allCards.filter(c => {
      const matchSearch = !q ||
        c.customerName.toLowerCase().includes(q) ||
        c.cardNumber.includes(q) ||
        c.accountNumber.toLowerCase().includes(q);
      const matchStatus = !s || c.status === s;
      const matchType = !t || c.cardType === t;
      const matchAccount = !a || c.accountType === a;
      return matchSearch && matchStatus && matchType && matchAccount;
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

  sortKey = signal('customerName');
  sortDir = signal<'asc' | 'desc'>('asc');

  sortBy(key: string) {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    // Simple sorting
    this.allCards.sort((a, b) => {
      const vA = a[key], vB = b[key];
      const res = vA < vB ? -1 : vA > vB ? 1 : 0;
      return this.sortDir() === 'asc' ? res : -res;
    });
  }

  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
  trackById(_: number, c: any) { return c.id; }

  setStatus(val: string) {
    this.activeStatus.set(val);
    this.currentPage.set(1);
  }

  hasFilters() {
    return this.searchQuery || this.activeStatus() || this.activeType || this.activeAccount;
  }

  clearFilters() {
    this.searchQuery = '';
    this.activeStatus.set('');
    this.activeType = '';
    this.activeAccount = '';
    this.currentPage.set(1);
  }

  statusClass(s: string) {
    return { 'ACTIVE': 'badge-active', 'FROZEN': 'badge-frozen', 'EXPIRED': 'badge-expired' }[s] || '';
  }

  fmtExpiry(m: string, y: string) { return `${m}/${y}`; }

  isExpiringSoon(m: string, y: string) {
    // Mock: say anything in 2024 is soon
    return y === '24';
  }

  avatarBg(initials: string): string {
    const colors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];
    const i = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length;
    return colors[i];
  }

  cardGradient(type: string) {
    return type === 'VISA'
      ? 'linear-gradient(135deg, #1e3a6e 0%, #3b82f6 100%)'
      : 'linear-gradient(135deg, #4b5563 0%, #111827 100%)';
  }

  viewCard(card: any) { this.selectedCard.set(card); }

  toggleFreeze(card: any) {
    card.status = card.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    this.updateKPIs();
  }

  submitIssue() {
    this.savingIssue.set(true);
    setTimeout(() => {
      const initials = this.issueForm.customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const newCard = {
        id: this.allCards.length + 1,
        customerName: this.issueForm.customerName,
        customerInitials: initials,
        customerEmail: this.issueForm.email || 'n/a',
        cardNumber: this.generateCardNumber(this.allCards.length + 1),
        cardType: this.issueForm.cardType,
        accountType: this.issueForm.accountType,
        accountNumber: this.issueForm.accountNumber,
        status: 'ACTIVE',
        expiryMonth: '12',
        expiryYear: '28',
        issuedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        cardholderName: this.issueForm.customerName.toUpperCase(),
        limit: 1000000
      };
      this.allCards = [newCard, ...this.allCards];
      this.updateKPIs();
      this.savingIssue.set(false);
      this.showIssue.set(false);
    }, 1500);
  }
}
