import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, inject, signal, computed, effect, untracked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
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

// ── Mock data helpers ──────────────────────────────────────────────────────
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const TOP_CUSTOMERS: TopCustomer[] = [
  { initials: 'AN', name: 'Amara Nkosi',    email: 'amara.nkosi@mail.cm',   balance: 4_850_000, transactions: 142, trend: 'up'   },
  { initials: 'DK', name: 'Didier Kamga',   email: 'dkamga@corp.cm',        balance: 3_920_000, transactions: 98,  trend: 'up'   },
  { initials: 'GO', name: 'Gisèle Onana',   email: 'gisele.o@mail.cm',      balance: 3_210_000, transactions: 76,  trend: 'flat' },
  { initials: 'JM', name: 'Jean Mballa',    email: 'j.mballa@nextbank.cm',  balance: 2_780_000, transactions: 65,  trend: 'up'   },
  { initials: 'LN', name: 'Luc Njoya',      email: 'l.njoya@corp.cm',       balance: 2_460_000, transactions: 54,  trend: 'down' },
  { initials: 'MB', name: 'Marie Beti',     email: 'marie.b@mail.cm',       balance: 1_990_000, transactions: 43,  trend: 'up'   },
  { initials: 'PZ', name: 'Paul Zang',      email: 'p.zang@corp.cm',        balance: 1_870_000, transactions: 39,  trend: 'flat' },
];

// Dataset sets indexed by DateRange
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
    totalBalance:   48_720_000,
    totalTx:        467,
    activeCustomers: 38,
    feesCollected:   124_500,
    breakdown: [
      { type: 'Deposits',    count: 210, volume: 28_400_000, color: '#10b981', icon: 'arrow-down-circle'  },
      { type: 'Withdrawals', count: 142, volume: 12_100_000, color: '#f59e0b', icon: 'arrow-up-circle'    },
      { type: 'Transfers',   count: 115, volume: 8_220_000,  color: '#3b82f6', icon: 'refresh-cw'         },
    ],
  },
  week: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    txVolume: [320,445,390,510,680,280,190],
    revenue:  [480,660,545,740,920,340,210],
    customers:[18,24,20,28,35,15,10],
    totalBalance:   48_720_000,
    totalTx:        2_815,
    activeCustomers: 74,
    feesCollected:   748_200,
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
    totalBalance:   48_720_000,
    totalTx:        21_540,
    activeCustomers: 112,
    feesCollected:   5_824_000,
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
    totalBalance:   48_720_000,
    totalTx:        86_430,
    activeCustomers: 158,
    feesCollected:   22_184_000,
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
  theme = inject(ThemeService);

  // ── Canvas refs ──
  @ViewChild('txLineCanvas')    txLineCanvas!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueBarCanvas') revenueBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('customerCanvas')  customerCanvas!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('cardPieCanvas')   cardPieCanvas!:   ElementRef<HTMLCanvasElement>;

  // ── State ──
  activeRange  = signal<DateRange>('month');
  activeTxType = signal<TxType>('');

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

  // ── Avatar colors ──
  private avatarColors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];

  // ── Computed ──
  data = computed(() => DATASET[this.activeRange()]);

  kpis = computed(() => {
    const d = this.data();
    return [
      {
        label: 'Total Balance',
        value: this.fmtXAF(d.totalBalance),
        delta: '+4.2%',
        positive: true,
        icon: 'balance',
        color: '#1e3a6e',
        bg: '#eef2ff',
      },
      {
        label: 'Total Transactions',
        value: d.totalTx.toLocaleString('fr-FR'),
        delta: '+12.8%',
        positive: true,
        icon: 'tx',
        color: '#10b981',
        bg: '#dcfce7',
      },
      {
        label: 'Active Customers',
        value: String(d.activeCustomers),
        delta: '+7.1%',
        positive: true,
        icon: 'customers',
        color: '#3b82f6',
        bg: '#dbeafe',
      },
      {
        label: 'Fees Collected',
        value: this.fmtXAF(d.feesCollected),
        delta: '-1.3%',
        positive: false,
        icon: 'fees',
        color: '#f59e0b',
        bg: '#fef3c7',
      },
    ];
  });

  breakdown = computed(() => this.data().breakdown);

  topCustomers = computed<TopCustomer[]>(() => {
    const type = this.activeTxType();
    // filter / sort by type would happen server-side; mock just returns same list
    return TOP_CUSTOMERS.slice(0, 7);
  });

  cardDistribution = [
    { label: 'VISA — Checking',     value: 38, color: '#1e3a6e' },
    { label: 'VISA — Savings',      value: 22, color: '#3b82f6' },
    { label: 'VISA — Business',     value: 12, color: '#60a5fa' },
    { label: 'MC — Checking',       value: 15, color: '#10b981' },
    { label: 'MC — Savings',        value: 8,  color: '#34d399' },
    { label: 'MC — Business',       value: 5,  color: '#6ee7b7' },
  ];

  // ── Charts ──
  private charts: Chart<any, any, any>[] = [];
  private chartsReady = false;

  constructor() {
    // Automatically rebuild charts when range or theme changes
    effect(() => {
      // Track these signals
      this.activeRange();
      this.theme.isDark();
      this.data(); // Ensure we track data changes even if range is the same

      if (this.chartsReady) {
        // Rebuild charts using untracked to avoid potential cyclic dependencies
        untracked(() => this.rebuildCharts());
      }
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.chartsReady = true;
    this.buildAllCharts();
  }

  ngOnDestroy() { this.destroyCharts(); }

  // ── Range / Filter ──
  setRange(r: DateRange) {
    this.activeRange.set(r);
  }

  setTxType(t: TxType) { this.activeTxType.set(t); }

  // ── Chart builders ──
  private buildAllCharts() {
    this.buildTxLineChart();
    this.buildRevenueChart();
    this.buildCustomerChart();
    this.buildCardPieChart();
  }

  private destroyCharts() {
    this.charts.forEach(c => c?.destroy?.());
    this.charts = [];
  }

  private rebuildCharts() {
    this.destroyCharts();
    this.buildAllCharts();
  }

  private get dark()       { return this.theme.isDark(); }
  private get grid()       { return this.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; }
  private get tick()       { return this.dark ? 'rgba(255,255,255,0.35)' : '#9ca3af'; }
  private get tooltipBg()  { return this.dark ? '#1e2435' : '#ffffff'; }
  private get tooltipFg()  { return this.dark ? '#f9fafb' : '#0d1117'; }

  private sharedTooltip() {
    return {
      backgroundColor: this.tooltipBg,
      titleColor: this.tooltipFg,
      bodyColor: this.tooltipFg,
      borderColor: this.grid,
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    };
  }

  private buildTxLineChart() {
    const ctx = this.txLineCanvas.nativeElement.getContext('2d')!;
    const d   = this.data();
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Transactions',
          data: d.txVolume,
          borderColor: '#10b981',
          backgroundColor: (context: any) => {
            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 260);
            gradient.addColorStop(0, 'rgba(16,185,129,0.28)');
            gradient.addColorStop(1, 'rgba(16,185,129,0)');
            return gradient;
          },
          borderWidth: 2.5,
          fill: true,
          tension: 0.45,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { ...this.sharedTooltip(), callbacks: { label: (c: any) => ` ${c.parsed.y} transactions` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: this.tick, font: { size: 11 } } },
          y: { 
            grid: { color: this.grid }, 
            beginAtZero: true,
            ticks: { color: this.tick, font: { size: 11 }, stepSize: Math.ceil(Math.max(...d.txVolume, 1) / 5) } 
          },
        },
      },
    });
    this.charts.push(chart);
  }

  private buildRevenueChart() {
    const ctx = this.revenueBarCanvas.nativeElement.getContext('2d')!;
    const d   = this.data();
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Revenue (k XAF)',
          data: d.revenue,
          backgroundColor: (context: any) => {
            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 260);
            gradient.addColorStop(0, '#1e3a6e');
            gradient.addColorStop(1, '#3b82f6');
            return gradient;
          },
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.65,
          categoryPercentage: 0.75,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { ...this.sharedTooltip(), callbacks: { label: (c: any) => ` ${c.parsed.y}k XAF` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: this.tick, font: { size: 11 } } },
          y: { 
            grid: { color: this.grid }, 
            beginAtZero: true,
            ticks: { 
              color: this.tick, 
              font: { size: 11 },
              stepSize: Math.ceil(Math.max(...d.revenue, 1) / 5)
            } 
          },
        },
      },
    });
    this.charts.push(chart);
  }

  private buildCustomerChart() {
    const ctx = this.customerCanvas.nativeElement.getContext('2d')!;
    const d   = this.data();
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'New Customers',
          data: d.customers,
          borderColor: '#f59e0b',
          backgroundColor: (context: any) => {
            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 220);
            gradient.addColorStop(0, 'rgba(245,158,11,0.22)');
            gradient.addColorStop(1, 'rgba(245,158,11,0)');
            return gradient;
          },
          borderWidth: 2.5,
          fill: true,
          tension: 0.45,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { ...this.sharedTooltip(), callbacks: { label: (c: any) => ` ${c.parsed.y} customers` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: this.tick, font: { size: 11 } } },
          y: { 
            grid: { color: this.grid }, 
            beginAtZero: true,
            ticks: { color: this.tick, font: { size: 11 } } 
          },
        },
      },
    });
    this.charts.push(chart);
  }

  private buildCardPieChart() {
    const ctx = this.cardPieCanvas.nativeElement.getContext('2d')!;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.cardDistribution.map(c => c.label),
        datasets: [{
          data:            this.cardDistribution.map(c => c.value),
          backgroundColor: this.cardDistribution.map(c => c.color),
          borderWidth: 0,
          hoverOffset: 10,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            ...this.sharedTooltip(),
            callbacks: { label: (c: any) => ` ${c.label}: ${c.parsed}%` },
          },
        },
      },
    });
    this.charts.push(chart);
  }

  // ── Formatting ──
  fmtXAF(n: number): string {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B XAF';
    if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M XAF';
    if (n >= 1_000)         return (n / 1_000).toFixed(0) + 'k XAF';
    return n.toLocaleString('fr-FR') + ' XAF';
  }

  fmtBalance(n: number): string {
    return n.toLocaleString('fr-FR').replace(/\s/g, '\u00a0') + ' XAF';
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