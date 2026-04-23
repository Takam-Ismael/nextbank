import { Component, OnInit, inject, signal, computed, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../core/services/theme.service';
import Chart from 'chart.js/auto';

export interface Transaction {
  id: string;
  reference: string;
  customerName: string;
  customerInitials: string;
  customerEmail: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  direction: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed' | 'flagged';
  channel: 'mobile' | 'web' | 'atm' | 'branch';
  date: string;
  time: string;
  description: string;
  balanceAfter: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1',  reference: 'TXN-2024-00312', customerName: 'Amara Nkosi',    customerInitials: 'AN', customerEmail: 'amara.nkosi@mail.cm',    type: 'deposit',    amount: 2500000,  direction: 'credit', status: 'completed', channel: 'mobile', date: 'Apr 22, 2024', time: '09:14 AM', description: 'Salary deposit – April 2024',         balanceAfter: 8400000  },
  { id: '2',  reference: 'TXN-2024-00311', customerName: 'Bertrand Fouda',  customerInitials: 'BF', customerEmail: 'b.fouda@mail.cm',         type: 'transfer',   amount: 850000,   direction: 'debit',  status: 'completed', channel: 'web',    date: 'Apr 22, 2024', time: '08:52 AM', description: 'Wire transfer to GTB-0091244',        balanceAfter: 3200000  },
  { id: '3',  reference: 'TXN-2024-00310', customerName: 'Céleste Manga',   customerInitials: 'CM', customerEmail: 'celeste.m@nextbank.cm',   type: 'withdrawal', amount: 300000,   direction: 'debit',  status: 'pending',   channel: 'atm',    date: 'Apr 22, 2024', time: '08:30 AM', description: 'ATM cash withdrawal – Bonanjo',       balanceAfter: 1100000  },
  { id: '4',  reference: 'TXN-2024-00309', customerName: 'Didier Kamga',    customerInitials: 'DK', customerEmail: 'dkamga@corp.cm',          type: 'payment',    amount: 4200000,  direction: 'debit',  status: 'flagged',   channel: 'web',    date: 'Apr 21, 2024', time: '06:05 PM', description: 'Vendor payment – SupplyCo Ltd',       balanceAfter: 12000000 },
  { id: '5',  reference: 'TXN-2024-00308', customerName: 'Esther Biyong',   customerInitials: 'EB', customerEmail: 'e.biyong@mail.cm',        type: 'deposit',    amount: 750000,   direction: 'credit', status: 'completed', channel: 'branch', date: 'Apr 21, 2024', time: '03:44 PM', description: 'Cash deposit over the counter',       balanceAfter: 2950000  },
  { id: '6',  reference: 'TXN-2024-00307', customerName: 'François Eto',    customerInitials: 'FE', customerEmail: 'f.eto@nextbank.cm',       type: 'transfer',   amount: 1200000,  direction: 'credit', status: 'completed', channel: 'mobile', date: 'Apr 21, 2024', time: '01:20 PM', description: 'Incoming transfer – Orange Money',    balanceAfter: 5500000  },
  { id: '7',  reference: 'TXN-2024-00306', customerName: 'Gisèle Onana',    customerInitials: 'GO', customerEmail: 'gisele.o@mail.cm',        type: 'payment',    amount: 95000,    direction: 'debit',  status: 'failed',    channel: 'web',    date: 'Apr 21, 2024', time: '11:58 AM', description: 'Electricity bill – ENEO auto-pay',   balanceAfter: 480000   },
  { id: '8',  reference: 'TXN-2024-00305', customerName: 'Henri Tchamba',   customerInitials: 'HT', customerEmail: 'h.tchamba@corp.cm',       type: 'deposit',    amount: 6000000,  direction: 'credit', status: 'completed', channel: 'branch', date: 'Apr 20, 2024', time: '04:10 PM', description: 'Business revenue deposit',            balanceAfter: 18700000 },
  { id: '9',  reference: 'TXN-2024-00304', customerName: 'Irène Abomo',     customerInitials: 'IA', customerEmail: 'irene.a@mail.cm',         type: 'withdrawal', amount: 200000,   direction: 'debit',  status: 'completed', channel: 'atm',    date: 'Apr 20, 2024', time: '02:30 PM', description: 'ATM withdrawal – Akwa branch',        balanceAfter: 670000   },
  { id: '10', reference: 'TXN-2024-00303', customerName: 'Jean Mballa',     customerInitials: 'JM', customerEmail: 'j.mballa@nextbank.cm',    type: 'transfer',   amount: 3000000,  direction: 'debit',  status: 'flagged',   channel: 'web',    date: 'Apr 20, 2024', time: '10:02 AM', description: 'Large transfer – under review',       balanceAfter: 9000000  },
  { id: '11', reference: 'TXN-2024-00302', customerName: 'Karine Moudiki',  customerInitials: 'KM', customerEmail: 'karine.m@mail.cm',        type: 'payment',    amount: 55000,    direction: 'debit',  status: 'completed', channel: 'mobile', date: 'Apr 19, 2024', time: '08:15 AM', description: 'Mobile data top-up – MTN',            balanceAfter: 320000   },
  { id: '12', reference: 'TXN-2024-00301', customerName: 'Luc Njoya',       customerInitials: 'LN', customerEmail: 'l.njoya@corp.cm',         type: 'deposit',    amount: 1800000,  direction: 'credit', status: 'pending',   channel: 'web',    date: 'Apr 19, 2024', time: '05:50 PM', description: 'Cheque deposit – processing',         balanceAfter: 4400000  },
  { id: '13', reference: 'TXN-2024-00300', customerName: 'Marie Beti',      customerInitials: 'MB', customerEmail: 'marie.b@mail.cm',         type: 'transfer',   amount: 450000,   direction: 'credit', status: 'completed', channel: 'mobile', date: 'Apr 18, 2024', time: '07:38 PM', description: 'P2P transfer from Fouda B.',          balanceAfter: 1350000  },
  { id: '14', reference: 'TXN-2024-00299', customerName: 'Nicolas Eyoum',   customerInitials: 'NE', customerEmail: 'n.eyoum@nextbank.cm',     type: 'withdrawal', amount: 500000,   direction: 'debit',  status: 'completed', channel: 'branch', date: 'Apr 18, 2024', time: '03:15 PM', description: 'Counter cash withdrawal',             balanceAfter: 2100000  },
  { id: '15', reference: 'TXN-2024-00298', customerName: 'Olivia Songolo',  customerInitials: 'OS', customerEmail: 'olivia.s@mail.cm',        type: 'payment',    amount: 180000,   direction: 'debit',  status: 'completed', channel: 'web',    date: 'Apr 17, 2024', time: '11:22 AM', description: 'School fees – IRIC Yaoundé',          balanceAfter: 900000   },
  { id: '16', reference: 'TXN-2024-00297', customerName: 'Paul Zang',       customerInitials: 'PZ', customerEmail: 'p.zang@corp.cm',          type: 'deposit',    amount: 12000000, direction: 'credit', status: 'flagged',   channel: 'branch', date: 'Apr 17, 2024', time: '09:00 AM', description: 'Large cash deposit – flagged',        balanceAfter: 34000000 },
  { id: '17', reference: 'TXN-2024-00296', customerName: 'Rachelle Ngom',   customerInitials: 'RN', customerEmail: 'r.ngom@mail.cm',          type: 'transfer',   amount: 250000,   direction: 'debit',  status: 'completed', channel: 'mobile', date: 'Apr 16, 2024', time: '06:40 PM', description: 'Transfer to savings account',         balanceAfter: 760000   },
  { id: '18', reference: 'TXN-2024-00295', customerName: 'Samuel Owona',    customerInitials: 'SO', customerEmail: 's.owona@nextbank.cm',     type: 'payment',    amount: 2200000,  direction: 'debit',  status: 'failed',    channel: 'web',    date: 'Apr 16, 2024', time: '04:30 PM', description: 'Loan repayment – insufficient funds', balanceAfter: 150000   },
  { id: '19', reference: 'TXN-2024-00294', customerName: 'Thérese Awono',   customerInitials: 'TA', customerEmail: 't.awono@mail.cm',         type: 'deposit',    amount: 900000,   direction: 'credit', status: 'completed', channel: 'atm',    date: 'Apr 15, 2024', time: '02:00 PM', description: 'ATM cash deposit – Douala',           balanceAfter: 3300000  },
  { id: '20', reference: 'TXN-2024-00293', customerName: 'Urbain Mvondo',   customerInitials: 'UM', customerEmail: 'u.mvondo@corp.cm',        type: 'transfer',   amount: 5500000,  direction: 'debit',  status: 'completed', channel: 'web',    date: 'Apr 15, 2024', time: '10:15 AM', description: 'Corporate wire – Procurement Dept.',  balanceAfter: 22000000 },
];

@Component({
  selector: 'nb-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit, AfterViewInit, OnDestroy {
  theme = inject(ThemeService);

  @ViewChild('flowCanvas') flowCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('typeCanvas') typeCanvas!: ElementRef<HTMLCanvasElement>;

  // ── Data ──
  allTransactions: Transaction[] = MOCK_TRANSACTIONS;

  // ── Filters ──
  searchQuery   = '';
  activeStatus  = signal('');
  activeType    = '';
  activeChannel = '';

  // ── Sort ──
  sortKey = signal<'reference' | 'amount' | 'date'>('date');
  sortDir = signal<'asc' | 'desc'>('desc');

  // ── Pagination ──
  currentPage = signal(1);
  pageSize    = 8;

  // ── Selection ──
  selectedIds = signal<Set<string>>(new Set());

  // ── Modals ──
  selectedTx = signal<Transaction | null>(null);
  showNew    = signal(false);
  savingNew  = signal(false);

  // ── New tx form ──
  newTx = { customerName: '', email: '', type: '', direction: '', amount: 0, channel: '', description: '' };

  // ── Charts ──
  private charts: any[] = [];
  flowPeriod = signal('7d');

  // ── Static config ──
  statusFilters = [
    { val: '',          label: 'All',       color: '#9ca3af' },
    { val: 'completed', label: 'Completed', color: '#16a34a' },
    { val: 'pending',   label: 'Pending',   color: '#d97706' },
    { val: 'failed',    label: 'Failed',    color: '#dc2626' },
    { val: 'flagged',   label: 'Flagged',   color: '#be185d' },
  ];

  txTypes = [
    { label: 'Deposits',    pct: 32, color: '#10b981' },
    { label: 'Withdrawals', pct: 22, color: '#f59e0b' },
    { label: 'Transfers',   pct: 28, color: '#3b82f6' },
    { label: 'Payments',    pct: 18, color: '#8b5cf6' },
  ];

  kpis = {
    totalVolume:   '42 750 000 XAF',
    totalDeposits: '24 400 000 XAF',
    totalCount:    '3 420',
    flaggedCount:  '12',
  };

  private avatarColors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];

  ngOnInit() {}

  ngAfterViewInit() {
    this.drawFlowChart();
    this.drawTypeChart();
  }

  ngOnDestroy() { this.charts.forEach(c => c?.destroy?.()); }

  // ── Computed ──
  filtered = computed(() => {
    const q  = this.searchQuery.toLowerCase();
    const st = this.activeStatus();
    const ty = this.activeType;
    const ch = this.activeChannel;
    const sk = this.sortKey();
    const sd = this.sortDir();

    let list = this.allTransactions.filter(tx => {
      if (q  && !tx.reference.toLowerCase().includes(q) && !tx.customerName.toLowerCase().includes(q) && !tx.description.toLowerCase().includes(q)) return false;
      if (st && tx.status  !== st) return false;
      if (ty && tx.type    !== ty) return false;
      if (ch && tx.channel !== ch) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      let va: any, vb: any;
      if (sk === 'amount') { va = a.amount; vb = b.amount; }
      else if (sk === 'date') { va = a.date + a.time; vb = b.date + b.time; }
      else { va = a.reference; vb = b.reference; }
      if (va < vb) return sd === 'asc' ? -1 : 1;
      if (va > vb) return sd === 'asc' ?  1 : -1;
      return 0;
    });
  });

  paginated        = computed(() => this.filtered().slice((this.currentPage() - 1) * this.pageSize, this.currentPage() * this.pageSize));
  totalPages       = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  pageStart        = computed(() => Math.min((this.currentPage() - 1) * this.pageSize + 1, this.filtered().length));
  pageEnd          = computed(() => Math.min(this.currentPage() * this.pageSize, this.filtered().length));
  allSelected      = computed(() => this.paginated().length > 0 && this.paginated().every(t => this.selectedIds().has(t.id)));
  hasActiveFilters = computed(() => !!this.activeStatus() || !!this.activeType || !!this.activeChannel);

  pageNumbers = computed(() => {
    const total = this.totalPages(), cur = this.currentPage();
    const start = Math.max(1, cur - 2), end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // ── Actions ──
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
  trackById(_: number, t: Transaction) { return t.id; }

  setStatus(val: string) { this.activeStatus.set(val); this.currentPage.set(1); }

  clearFilters() {
    this.activeStatus.set(''); this.activeType = ''; this.activeChannel = '';
    this.searchQuery = ''; this.currentPage.set(1);
  }

  sortBy(key: 'reference' | 'amount' | 'date') {
    if (this.sortKey() === key) this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    else { this.sortKey.set(key); this.sortDir.set('desc'); }
  }

  isSelected(id: string)   { return this.selectedIds().has(id); }
  toggleSelect(id: string) { const s = new Set(this.selectedIds()); s.has(id) ? s.delete(id) : s.add(id); this.selectedIds.set(s); }
  clearSelection()          { this.selectedIds.set(new Set()); }

  toggleAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    const s = new Set(this.selectedIds());
    this.paginated().forEach(t => checked ? s.add(t.id) : s.delete(t.id));
    this.selectedIds.set(s);
  }

  flagSelected() {
    this.allTransactions = this.allTransactions.map(t =>
      this.selectedIds().has(t.id) ? { ...t, status: 'flagged' as const } : t
    );
    this.clearSelection();
  }

  viewTx(tx: Transaction) { this.selectedTx.set(tx); }
  flagTx(tx: Transaction) { tx.status = tx.status === 'flagged' ? 'completed' : 'flagged'; }

  statusClass(s: string): string {
    const m: Record<string, string> = {
      completed: 'badge-completed',
      pending:   'badge-pending',
      failed:    'badge-failed',
      flagged:   'badge-flagged',
    };
    return m[s] || '';
  }

  avatarBg(initials: string): string {
    const i = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % this.avatarColors.length;
    return this.avatarColors[i];
  }

  fmtAmount(n: number): string {
    return n.toLocaleString('fr-FR').replace(/\s/g, '\u00a0');
  }

  exportCSV() {
    const rows = [['Reference','Customer','Email','Type','Direction','Amount','Status','Channel','Date','Time','Description']];
    this.filtered().forEach(tx => rows.push([
      tx.reference, tx.customerName, tx.customerEmail, tx.type,
      tx.direction, String(tx.amount), tx.status, tx.channel,
      tx.date, tx.time, tx.description,
    ]));
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  submitNew() {
    if (!this.newTx.customerName || !this.newTx.type || !this.newTx.amount) return;
    this.savingNew.set(true);
    setTimeout(() => {
      const initials = this.newTx.customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const now = new Date();
      this.allTransactions = [{
        id:               String(this.allTransactions.length + 1),
        reference:        `TXN-2024-${String(this.allTransactions.length + 1).padStart(5, '0')}`,
        customerName:     this.newTx.customerName,
        customerInitials: initials,
        customerEmail:    this.newTx.email,
        type:             this.newTx.type    as Transaction['type'],
        direction:        this.newTx.direction as Transaction['direction'],
        amount:           Number(this.newTx.amount),
        status:           'pending',
        channel:          this.newTx.channel as Transaction['channel'],
        date:             now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        time:             now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        description:      this.newTx.description || '—',
        balanceAfter:     0,
      }, ...this.allTransactions];
      this.savingNew.set(false);
      this.showNew.set(false);
      this.newTx = { customerName: '', email: '', type: '', direction: '', amount: 0, channel: '', description: '' };
    }, 1000);
  }

  alertIcon(severity: string): string {
    if (severity === 'high')   return 'M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z';
    if (severity === 'medium') return 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 6v4m0 4h.01';
    return 'M13 16h-1v-4h-1m1-4h.01';
  }

  // ── Charts ──
  private isDark()      { return this.theme.isDark(); }
  private gridColor()   { return this.isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }
  private tickColor()   { return this.isDark() ? 'rgba(255,255,255,0.4)'  : '#9ca3af'; }
  private tooltipBg()   { return this.isDark() ? '#1e2435' : '#ffffff'; }
  private tooltipText() { return this.isDark() ? '#f9fafb' : '#0d1117'; }

  private drawFlowChart() {
    const ctx    = this.flowCanvas.nativeElement.getContext('2d')!;
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const credits = [8.4, 6.2, 11.3, 7.8, 14.2, 5.1, 9.6];
    const debits  = [5.2, 7.8,  6.4, 9.1,  8.3, 3.2, 6.8];

    const gCredit = ctx.createLinearGradient(0, 0, 0, 230);
    gCredit.addColorStop(0, 'rgba(16,185,129,0.25)');
    gCredit.addColorStop(1, 'rgba(16,185,129,0)');

    const gDebit = ctx.createLinearGradient(0, 0, 0, 230);
    gDebit.addColorStop(0, 'rgba(30,58,110,0.2)');
    gDebit.addColorStop(1, 'rgba(30,58,110,0)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Credits', data: credits, borderColor: '#10b981', borderWidth: 2.5, fill: true, backgroundColor: gCredit, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#10b981', pointHoverRadius: 6 },
          { label: 'Debits',  data: debits,  borderColor: '#1e3a6e', borderWidth: 2.5, fill: true, backgroundColor: gDebit,  tension: 0.4, pointRadius: 3, pointBackgroundColor: '#1e3a6e', pointHoverRadius: 6 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.tooltipBg(), titleColor: this.tooltipText(), bodyColor: this.tooltipText(),
            borderColor: this.gridColor(), borderWidth: 1, padding: 10,
            callbacks: { label: (c: any) => `${c.dataset.label}: ${c.parsed.y}M XAF` },
          },
        },
        scales: {
          x: { grid: { color: this.gridColor() }, ticks: { color: this.tickColor(), font: { size: 11 } } },
          y: { grid: { color: this.gridColor() }, ticks: { color: this.tickColor(), font: { size: 11 }, callback: (v: any) => v + 'M' }, min: 0 },
        },
      },
    });
    this.charts.push(chart);
  }

  private drawTypeChart() {
    const ctx   = this.typeCanvas.nativeElement.getContext('2d')!;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.txTypes.map(t => t.label),
        datasets: [{ data: this.txTypes.map(t => t.pct), backgroundColor: this.txTypes.map(t => t.color), borderWidth: 0, hoverOffset: 8 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.tooltipBg(), titleColor: this.tooltipText(), bodyColor: this.tooltipText(),
            borderColor: this.gridColor(), borderWidth: 1, padding: 10,
            callbacks: { label: (c: any) => `${c.label}: ${c.parsed}%` },
          },
        },
      },
    });
    this.charts.push(chart);
  }
}