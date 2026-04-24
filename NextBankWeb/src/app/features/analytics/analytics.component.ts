import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, inject, signal, computed, effect, untracked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { DataService } from '../../core/services/data.service';
import { CardService } from '../../core/services/card.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';

// ── Types ──────────────────────────────────────────────────────────────────
export type DateRange = 'today' | 'week' | 'month' | 'quarter';
export type TxType    = '' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

interface TopCustomer {
  initials: string;
  name: string;
  email: string;
  balance: number;
  transactions: number;
  trend: 'up' | 'down' | 'flat';
}

interface TxBreakdown {
  type: string;
  count: number;
  volume: number;
  color: string;
  icon: string;
}

// ── Fallback dataset (used for charts — real tx data not yet available) ────
const DATASET: Record<DateRange, {
  labels: string[];
  txVolume: number[];
  revenue: number[];
  customers: number[];
  totalBalance: number;
  totalTx: number;
  activeCustomers: number;
  feesCollected: number;
  breakdown: TxBreakdown[];
}> = {
  today: {
    labels: ['08h','09h','10h','11h','12h','13h','14h','15h','16h','17h'],
    txVolume: [12,34,28,55,70,45,62,80,48,33],
    revenue:  [18,42,35,68,90,55,77,98,60,40],
    customers:[2,4,3,7,9,5,8,11,6,4],
    totalBalance: 48_720_000, totalTx: 467, activeCustomers: 38, feesCollected: 124_500,
    breakdown: [
      { type: 'Deposits',    count: 210, volume: 28_400_000, color: '#10b981', icon: 'arrow-down-circle' },
      { type: 'Withdrawals', count: 142, volume: 12_100_000, color: '#f59e0b', icon: 'arrow-up-circle'   },
      { type: 'Transfers',   count: 115, volume:  8_220_000, color: '#3b82f6', icon: 'refresh-cw'        },
    ],
  },
  week: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    txVolume: [320,445,390,510,680,280,190],
    revenue:  [480,660,545,740,920,340,210],
    customers:[18,24,20,28,35,15,10],
    totalBalance: 48_720_000, totalTx: 2_815, activeCustomers: 74, feesCollected: 748_200,
    breakdown: [
      { type: 'Deposits',    count: 1_260, volume: 168_000_000, color: '#10b981', icon: 'arrow-down-circle' },
      { type: 'Withdrawals', count:   870, volume:  72_800_000, color: '#f59e0b', icon: 'arrow-up-circle'   },
      { type: 'Transfers',   count:   685, volume:  49_300_000, color: '#3b82f6', icon: 'refresh-cw'        },
    ],
  },
  month: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    txVolume: [1200,1450,1320,1680,1920,1540,1760,2100,1890,2240,2050,2380],
    revenue:  [1800,2200,1950,2500,2900,2300,2650,3100,2800,3300,3050,3600],
    customers:[45,52,48,61,70,58,66,80,72,88,78,95],
    totalBalance: 48_720_000, totalTx: 21_540, activeCustomers: 112, feesCollected: 5_824_000,
    breakdown: [
      { type: 'Deposits',    count: 9_680, volume: 1_290_000_000, color: '#10b981', icon: 'arrow-down-circle' },
      { type: 'Withdrawals', count: 6_720, volume:   560_000_000, color: '#f59e0b', icon: 'arrow-up-circle'   },
      { type: 'Transfers',   count: 5_140, volume:   378_000_000, color: '#3b82f6', icon: 'refresh-cw'        },
    ],
  },
  quarter: {
    labels: ['Q1','Q2','Q3','Q4'],
    txVolume: [3970,6140,5750,6670],
    revenue:  [5950,9200,8550,10000],
    customers:[52,70,80,95],
    totalBalance: 48_720_000, totalTx: 86_430, activeCustomers: 158, feesCollected: 22_184_000,
    breakdown: [
      { type: 'Deposits',    count: 38_720, volume: 5_160_000_000, color: '#10b981', icon: 'arrow-down-circle' },
      { type: 'Withdrawals', count: 26_880, volume: 2_240_000_000, color: '#f59e0b', icon: 'arrow-up-circle'   },
      { type: 'Transfers',   count: 20_830, volume: 1_512_000_000, color: '#3b82f6', icon: 'refresh-cw'        },
    ],
  },
};

// ── Component ──────────────────────────────────────────────────────────────
@Component({
  selector: 'nb-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  theme            = inject(ThemeService);
  private dataSvc  = inject(DataService);
  private cardSvc  = inject(CardService);

  @ViewChild('txLineCanvas')     txLineCanvas!:     ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueBarCanvas') revenueBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('customerCanvas')   customerCanvas!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('cardPieCanvas')    cardPieCanvas!:    ElementRef<HTMLCanvasElement>;

  activeRange  = signal<DateRange>('month');
  activeTxType = signal<TxType>('');
  loading      = signal(true);

  realStats     = signal<any>(null);
  realCards     = signal<any[]>([]);
  realCustomers = signal<any[]>([]);

  ranges: { val: DateRange; label: string }[] = [
    { val: 'today',   label: 'Today'   },
    { val: 'week',    label: 'Week'    },
    { val: 'month',   label: 'Month'   },
    { val: 'quarter', label: 'Quarter' },
  ];

  txTypes: { val: TxType; label: string }[] = [
    { val: '',           label: 'All Types'   },
    { val: 'DEPOSIT',    label: 'Deposits'    },
    { val: 'WITHDRAWAL', label: 'Withdrawals' },
    { val: 'TRANSFER',   label: 'Transfers'   },
  ];

  private avatarColors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];

  // ── Computed ──────────────────────────────────────────────────────────────
  dataSet = computed(() => DATASET[this.activeRange()]);

  kpis = computed(() => {
    const stats = this.realStats();
    const cards = this.realCards();
    const d     = this.dataSet();
    return [
      { label: 'Total Balance',      value: this.fmtXAF(stats?.totalRevenue ?? d.totalBalance),                                                  delta: '+4.2%',  positive: true,  icon: 'balance',    color: '#1e3a6e', bg: '#eef2ff' },
      { label: 'Total Transactions', value: (stats?.transactions ?? d.totalTx).toLocaleString('fr-FR'),                                          delta: '+12.8%', positive: true,  icon: 'tx',         color: '#10b981', bg: '#dcfce7' },
      { label: 'Active Customers',   value: String(stats?.activeUsers ?? d.activeCustomers),                                                     delta: '+7.1%',  positive: true,  icon: 'customers',  color: '#3b82f6', bg: '#dbeafe' },
      { label: 'Total Cards',        value: String(cards ? cards.length : 0),                                           delta: `${cards ? cards.filter((c:any) => c.status === 'ACTIVE').length : 0} active`, positive: true, icon: 'fees', color: '#f59e0b', bg: '#fef3c7' },
    ];
  });

  breakdown = computed(() => this.dataSet().breakdown);

  topCustomers = computed<TopCustomer[]>(() => {
    const customers = this.realCustomers();
    if (customers.length > 0) {
      return customers.slice(0, 7).map((c: any) => ({
        initials:     (c.fullName || c.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        name:         c.fullName || c.name || 'Unknown',
        email:        c.email || '',
        balance:      c.accounts?.reduce((sum: number, a: any) => sum + (a.balance || 0), 0) ?? 0,
        transactions: 0,
        trend:        'flat' as const,
      }));
    }
    // Fallback
    return [
      { initials: 'AN', name: 'Amara Nkosi',  email: 'amara.nkosi@mail.cm',  balance: 4_850_000, transactions: 142, trend: 'up'   },
      { initials: 'DK', name: 'Didier Kamga', email: 'dkamga@corp.cm',       balance: 3_920_000, transactions: 98,  trend: 'up'   },
      { initials: 'GO', name: 'Gisèle Onana', email: 'gisele.o@mail.cm',     balance: 3_210_000, transactions: 76,  trend: 'flat' },
    ];
  });

  cardDistribution = computed(() => {
    const cards = this.realCards();
    if (cards.length === 0) {
      return [
        { label: 'VISA',       value: 50, color: '#1e3a6e' },
        { label: 'MASTERCARD', value: 50, color: '#10b981' },
      ];
    }
    const total  = cards.length;
    const visa   = cards.filter((c: any) => c.cardType === 'VISA').length;
    const mc     = cards.filter((c: any) => c.cardType === 'MASTERCARD').length;
    const active = cards.filter((c: any) => c.status === 'ACTIVE').length;
    const frozen = cards.filter((c: any) => c.status === 'FROZEN').length;
    return [
      { label: 'VISA',        value: Math.round((visa   / total) * 100), color: '#1e3a6e' },
      { label: 'MASTERCARD',  value: Math.round((mc     / total) * 100), color: '#10b981' },
      { label: 'Active',      value: Math.round((active / total) * 100), color: '#3b82f6' },
      { label: 'Frozen',      value: Math.round((frozen / total) * 100), color: '#f59e0b' },
    ];
  });

  // ── Charts ────────────────────────────────────────────────────────────────
  private charts: Chart<any, any, any>[] = [];
  private chartsReady = false;

  constructor() {
    effect(() => {
      this.activeRange();
      this.theme.isDark();
      if (this.chartsReady) {
        untracked(() => this.rebuildCharts());
      }
    });
  }

  ngOnInit() { this.loadRealData(); }

  loadRealData() {
    this.loading.set(true);
    forkJoin({
      stats:     this.dataSvc.getGlobalStats().pipe(catchError(() => of(null))),
      customers: this.dataSvc.getCustomers().pipe(catchError(() => of([]))),
      cards:     this.cardSvc.getAllCards(0, 500).pipe(catchError(() => of({ content: [] }))),
    }).subscribe({
      next: ({ stats, customers, cards }) => {
        this.realStats.set(stats);
        this.realCustomers.set(Array.isArray(customers) ? customers : []);
        this.realCards.set(cards?.content ?? (Array.isArray(cards) ? cards : []));
        this.loading.set(false);
        if (this.chartsReady) this.rebuildCharts();
      },
      error: () => { this.loading.set(false); }
    });
  }

  ngAfterViewInit() {
    this.chartsReady = true;
    this.destroyCharts(); // clear any stale canvas instances
    if (!this.loading()) {
      setTimeout(() => this.buildAllCharts(), 0);
    } else {
      const iv = setInterval(() => {
        if (!this.loading()) { clearInterval(iv); setTimeout(() => this.buildAllCharts(), 0); }
      }, 200);
    }
  }

  ngOnDestroy() { this.destroyCharts(); }

  setRange(r: DateRange) { this.activeRange.set(r); }
  setTxType(t: TxType)   { this.activeTxType.set(t); }

  private buildAllCharts() {
    this.buildTxLineChart();
    this.buildRevenueChart();
    this.buildCustomerChart();
    this.buildCardPieChart();
  }

  private destroyCharts() { this.charts.forEach(c => c?.destroy?.()); this.charts = []; }
  private rebuildCharts()  { this.destroyCharts(); this.buildAllCharts(); }

  private get dark()      { return this.theme.isDark(); }
  private get grid()      { return this.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; }
  private get tick()      { return this.dark ? 'rgba(255,255,255,0.35)' : '#9ca3af'; }
  private get tooltipBg() { return this.dark ? '#1e2435' : '#ffffff'; }
  private get tooltipFg() { return this.dark ? '#f9fafb' : '#0d1117'; }

  private sharedTooltip() {
    return { backgroundColor: this.tooltipBg, titleColor: this.tooltipFg, bodyColor: this.tooltipFg, borderColor: this.grid, borderWidth: 1, padding: 12, cornerRadius: 8 };
  }

  private buildTxLineChart() {
    if (!this.txLineCanvas) return;
    const existing = Chart.getChart(this.txLineCanvas.nativeElement);
    if (existing) existing.destroy();
    const ctx = this.txLineCanvas.nativeElement.getContext('2d'); if (!ctx) return;
    const d = this.dataSet();
    this.charts.push(new Chart(ctx, {
      type: 'line',
      data: { labels: d.labels, datasets: [{ label: 'Transactions', data: d.txVolume, borderColor: '#10b981', backgroundColor: (c: any) => { const g = c.chart.ctx.createLinearGradient(0,0,0,260); g.addColorStop(0,'rgba(16,185,129,0.28)'); g.addColorStop(1,'rgba(16,185,129,0)'); return g; }, borderWidth: 2.5, fill: true, tension: 0.45, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#10b981', pointBorderColor: '#fff', pointBorderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip: { ...this.sharedTooltip(), callbacks: { label: (c: any) => ` ${c.parsed.y} transactions` } } }, scales: { x: { grid: { display: false }, ticks: { color: this.tick, font: { size: 11 } } }, y: { grid: { color: this.grid }, beginAtZero: true, ticks: { color: this.tick, font: { size: 11 } } } } },
    }));
  }

  private buildRevenueChart() {
    if (!this.revenueBarCanvas) return;
    const existing = Chart.getChart(this.revenueBarCanvas.nativeElement);
    if (existing) existing.destroy();
    const ctx = this.revenueBarCanvas.nativeElement.getContext('2d'); if (!ctx) return;
    const d = this.dataSet();
    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: { labels: d.labels, datasets: [{ label: 'Revenue (k XAF)', data: d.revenue, backgroundColor: (c: any) => { const g = c.chart.ctx.createLinearGradient(0,0,0,260); g.addColorStop(0,'#1e3a6e'); g.addColorStop(1,'#3b82f6'); return g; }, borderRadius: 6, borderSkipped: false, barPercentage: 0.65, categoryPercentage: 0.75 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...this.sharedTooltip(), callbacks: { label: (c: any) => ` ${c.parsed.y}k XAF` } } }, scales: { x: { grid: { display: false }, ticks: { color: this.tick, font: { size: 11 } } }, y: { grid: { color: this.grid }, beginAtZero: true, ticks: { color: this.tick, font: { size: 11 } } } } },
    }));
  }

  private buildCustomerChart() {
    if (!this.customerCanvas) return;
    const existing = Chart.getChart(this.customerCanvas.nativeElement);
    if (existing) existing.destroy();
    const ctx = this.customerCanvas.nativeElement.getContext('2d'); if (!ctx) return;
    const d = this.dataSet();
    this.charts.push(new Chart(ctx, {
      type: 'line',
      data: { labels: d.labels, datasets: [{ label: 'New Customers', data: d.customers, borderColor: '#f59e0b', backgroundColor: (c: any) => { const g = c.chart.ctx.createLinearGradient(0,0,0,220); g.addColorStop(0,'rgba(245,158,11,0.22)'); g.addColorStop(1,'rgba(245,158,11,0)'); return g; }, borderWidth: 2.5, fill: true, tension: 0.45, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#f59e0b', pointBorderColor: '#fff', pointBorderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip: { ...this.sharedTooltip(), callbacks: { label: (c: any) => ` ${c.parsed.y} customers` } } }, scales: { x: { grid: { display: false }, ticks: { color: this.tick, font: { size: 11 } } }, y: { grid: { color: this.grid }, beginAtZero: true, ticks: { color: this.tick, font: { size: 11 } } } } },
    }));
  }

  private buildCardPieChart() {
    if (!this.cardPieCanvas) return;
    const existing = Chart.getChart(this.cardPieCanvas.nativeElement);
    if (existing) existing.destroy();
    const ctx = this.cardPieCanvas.nativeElement.getContext('2d'); if (!ctx) return;
    const dist = this.cardDistribution();
    this.charts.push(new Chart(ctx, {
      type: 'doughnut',
      data: { labels: dist.map(c => c.label), datasets: [{ data: dist.map(c => c.value), backgroundColor: dist.map(c => c.color), borderWidth: 0, hoverOffset: 10 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...this.sharedTooltip(), callbacks: { label: (c: any) => ` ${c.label}: ${c.parsed}%` } } } } as any,
    }));
  }

  // ── Formatting ────────────────────────────────────────────────────────────
  fmtXAF(n: number): string {
    if (!n) return '0 XAF';
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B XAF';
    if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M XAF';
    if (n >= 1_000)         return (n / 1_000).toFixed(0) + 'k XAF';
    return n.toLocaleString('fr-FR') + ' XAF';
  }

  fmtBalance(n: number): string {
    return (n || 0).toLocaleString('fr-FR').replace(/\s/g, '\u00a0') + ' XAF';
  }

  avatarBg(initials: string): string {
    if (!initials) return this.avatarColors[0];
    const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    return this.avatarColors[code % this.avatarColors.length];
  }

  breakdownPct(item: TxBreakdown): number {
    const total = this.breakdown().reduce((s, b) => s + b.count, 0);
    return total ? Math.round((item.count / total) * 100) : 0;
  }
}
