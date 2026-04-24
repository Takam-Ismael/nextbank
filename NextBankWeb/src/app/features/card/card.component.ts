import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService, CardResponse } from '../../core/services/card.service';

@Component({
  selector: 'nb-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  private cardService = inject(CardService);

  viewMode    = signal<'table' | 'grid'>('table');
  allCards    = signal<CardResponse[]>([]);
  loading     = signal(true);
  error       = signal('');
  searchQuery = '';
  currentPage = signal(1);
  pageSize    = 8;
  selectedCard = signal<CardResponse | null>(null);
  togglingId   = signal<number | null>(null);

  statusFilters = [
    { label: 'All Cards', val: '',        color: '' },
    { label: 'Active',    val: 'ACTIVE',  color: '#10b981' },
    { label: 'Frozen',    val: 'FROZEN',  color: '#3b82f6' },
  ];
  activeStatus = signal('');
  activeType   = '';

  sortKey = signal('cardholderName');
  sortDir = signal<'asc' | 'desc'>('asc');

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.loading.set(true);
    this.error.set('');
    this.cardService.getAllCards(0, 200).subscribe({
      next: (res) => {
        // Spring Page object returns { content: [...] }
        const cards: CardResponse[] = res?.content ?? (Array.isArray(res) ? res : []);
        this.allCards.set(cards);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load cards. Is the cards service running on port 8086?');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  // ── KPIs ──────────────────────────────────────────────────────────────────
  kpis = computed(() => ({
    total:  this.allCards().length,
    active: this.allCards().filter(c => c.status === 'ACTIVE').length,
    frozen: this.allCards().filter(c => c.status === 'FROZEN').length,
    visa:   this.allCards().filter(c => c.cardType === 'VISA').length,
  }));

  // ── Filtering ─────────────────────────────────────────────────────────────
  filtered = computed(() => {
    const q = this.searchQuery.toLowerCase();
    const s = this.activeStatus();
    const t = this.activeType;

    let list = this.allCards().filter(c => {
      const matchSearch = !q ||
        c.cardholderName.toLowerCase().includes(q) ||
        c.cardLastFour.includes(q) ||
        c.accountNumber.toLowerCase().includes(q);
      const matchStatus = !s || c.status === s;
      const matchType   = !t || c.cardType === t;
      return matchSearch && matchStatus && matchType;
    });

    // Sort
    const key = this.sortKey() as keyof CardResponse;
    const dir = this.sortDir();
    return [...list].sort((a, b) => {
      const vA = a[key], vB = b[key];
      const res = (vA ?? '') < (vB ?? '') ? -1 : (vA ?? '') > (vB ?? '') ? 1 : 0;
      return dir === 'asc' ? res : -res;
    });
  });

  paginated   = computed(() => {
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

  // ── Actions ───────────────────────────────────────────────────────────────
  sortBy(key: string) {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  setStatus(val: string) { this.activeStatus.set(val); this.currentPage.set(1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
  trackById(_: number, c: CardResponse) { return c.id; }

  hasFilters() { return this.searchQuery || this.activeStatus() || this.activeType; }
  clearFilters() {
    this.searchQuery = '';
    this.activeStatus.set('');
    this.activeType = '';
    this.currentPage.set(1);
  }

  viewCard(card: CardResponse) { this.selectedCard.set(card); }

  toggleFreeze(card: CardResponse) {
    this.togglingId.set(card.id);
    this.cardService.toggleFreeze(card.id).subscribe({
      next: (updated) => {
        this.allCards.update(cards =>
          cards.map(c => c.id === updated.id ? updated : c)
        );
        // Update selected card if open
        if (this.selectedCard()?.id === updated.id) {
          this.selectedCard.set(updated);
        }
        this.togglingId.set(null);
      },
      error: (err) => {
        console.error('Failed to toggle freeze:', err);
        this.togglingId.set(null);
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  statusClass(s: string) {
    return { 'ACTIVE': 'badge-active', 'FROZEN': 'badge-frozen' }[s] || '';
  }

  fmtExpiry(month: number, year: number): string {
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
  }

  isExpiringSoon(month: number, year: number): boolean {
    const now = new Date();
    const expiry = new Date(year, month - 1);
    const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diff <= 3 && diff >= 0;
  }

  isExpired(month: number, year: number): boolean {
    const now = new Date();
    const expiry = new Date(year, month - 1);
    return expiry < now;
  }

  cardStatus(card: CardResponse): string {
    if (this.isExpired(card.expiryMonth, card.expiryYear)) return 'EXPIRED';
    return card.status;
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  avatarBg(name: string): string {
    const colors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return colors[code % colors.length];
  }

  cardGradient(type: string): string {
    return type === 'VISA'
      ? 'linear-gradient(135deg, #1e3a6e 0%, #3b82f6 100%)'
      : 'linear-gradient(135deg, #4b5563 0%, #111827 100%)';
  }

  maskedNumber(lastFour: string): string {
    return `**** **** **** ${lastFour}`;
  }
}
