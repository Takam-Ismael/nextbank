import { Component, OnInit, OnDestroy, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Customer, StatCard } from '../../core/services/data.service';
import { ThemeService } from '../../core/services/theme.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'nb-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">

      <!-- ── HERO BANNER ──────────────────────────────────── -->
      <div class="hero-banner">
        <div class="hero-left">
          <p class="hero-greeting">Good morning, Admin</p>
          <h1 class="hero-title">Welcome to NextBank HQ</h1>
          <p class="hero-desc">
            Your platform is performing exceptionally. Live monitoring of transactions and user growth.
          </p>
          <!-- 3 mini stat pills inside hero -->
          <div class="hero-pills">
            <div class="hero-pill">
              <span class="pill-val">{{ activeUsersCount() }}</span>
              <span class="pill-label">Active Users</span>
              <span class="pill-change up">+Live</span>
            </div>
            <div class="hero-pill">
              <span class="pill-val">{{ fmtBalance(totalRevenue() / (activeUsersCount() || 1)) }}</span>
              <span class="pill-label">Avg. Balance</span>
              <span class="pill-change up">+Live</span>
            </div>
            <div class="hero-pill">
              <span class="pill-val">99.9%</span>
              <span class="pill-label">Uptime</span>
              <span class="pill-change up">Stable</span>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <p class="hero-rev-label">Total Deposits · 2024</p>
          <p class="hero-rev-val">{{ fmtBalance(totalRevenue()) }}</p>
          <!-- decorative chart shape -->
          <svg class="hero-deco" viewBox="0 0 120 80" fill="none">
            <path d="M0 60 C20 50 30 30 50 25 C70 20 90 35 120 10" stroke="rgba(255,255,255,0.25)" stroke-width="2" fill="none"/>
            <path d="M0 60 C20 50 30 30 50 25 C70 20 90 35 120 10 L120 80 L0 80Z" fill="rgba(255,255,255,0.05)"/>
            <circle cx="120" cy="10" r="5" fill="rgba(255,255,255,0.5)"/>
            <text x="90" y="8" fill="rgba(255,255,255,0.6)" font-size="10" font-family="Inter">↗+</text>
          </svg>
        </div>
      </div>

      <!-- ── STAT CARDS ─────────────────────────────────────── -->
      <div class="stat-grid">
        <div class="stat-card" *ngFor="let s of stats">
          <div class="stat-top">
            <div class="stat-icon" [style.background]="s.iconBg + '22'">
              <span class="stat-icon-inner" [style.background]="s.iconBg">{{ s.icon }}</span>
            </div>
            <span class="stat-change" [class.up]="s.changeUp" [class.down]="!s.changeUp">
              {{ s.change }}
            </span>
          </div>
          <div class="stat-val">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>

      <!-- ── CHARTS ROW ─────────────────────────────────────── -->
      <div class="charts-row">

        <!-- Revenue line chart -->
        <div class="chart-card revenue-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Revenue Overview</h3>
              <p class="chart-sub">Monthly revenue trend</p>
            </div>
            <div class="period-tabs">
              <button *ngFor="let p of ['7d','30d','90d','1y']"
                (click)="revPeriod.set(p)"
                [class.active]="revPeriod() === p"
                class="period-btn">{{ p }}</button>
            </div>
          </div>
          <div class="chart-body">
            <canvas #revenueCanvas class="chart-canvas"></canvas>
          </div>
        </div>

        <!-- Donut chart — Account types -->
        <div class="chart-card donut-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Account Types</h3>
              <p class="chart-sub">Distribution of account types</p>
            </div>
          </div>
          <div class="donut-wrap">
            <canvas #donutCanvas class="donut-canvas"></canvas>
          </div>
          <div class="donut-legend">
            <div class="legend-item" *ngFor="let a of accountTypes">
              <span class="legend-dot" [style.background]="a.color"></span>
              <span class="legend-label">{{ a.label }}</span>
              <span class="legend-val">{{ a.value }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BOTTOM ROW ─────────────────────────────────────── -->
      <div class="bottom-row">

        <!-- Weekly activity bar chart -->
        <div class="chart-card activity-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Weekly Activity</h3>
              <p class="chart-sub">Transaction volume by day</p>
            </div>
            <button class="more-btn">•••</button>
          </div>
          <div class="chart-body">
            <canvas #weeklyCanvas class="chart-canvas"></canvas>
          </div>
          <div class="chart-legend-row">
            <span class="legend-pill" style="--c:#14b8a6">● Deposits</span>
            <span class="legend-pill" style="--c:#3b82f6">● Withdrawals</span>
            <span class="legend-pill" style="--c:#f59e0b">● Transfers</span>
          </div>
        </div>

        <!-- Security alerts -->
        <div class="chart-card alerts-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Security Alerts</h3>
              <p class="chart-sub">Flagged activities</p>
            </div>
            <span class="alerts-badge">{{ alerts.length }} New</span>
          </div>
          <div class="alerts-list">
            <div class="alert-item" *ngFor="let a of alerts">
              <div class="alert-icon" [class]="'alert-icon-' + a.severity">
                {{ a.icon }}
              </div>
              <div class="alert-meta">
                <div class="alert-title">{{ a.title }}</div>
                <div class="alert-info">ID: {{ a.id }} · {{ a.time }}</div>
              </div>
            </div>
          </div>
          <a class="view-alerts-link" routerLink="/compliance">View all alerts →</a>
        </div>
      </div>

      <!-- ── RECENT CUSTOMERS TABLE ─────────────────────────── -->
      <div class="chart-card customers-table-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Recent Customers</h3>
            <p class="chart-sub">Newly registered and active customers</p>
          </div>
          <a class="view-all-link" routerLink="/customers">View all ›</a>
        </div>
        <table class="customers-table">
          <thead>
            <tr>
              <th>CUSTOMER</th>
              <th>STATUS</th>
              <th>BALANCE</th>
              <th>JOINED</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of recentCustomers">
              <td>
                <div class="cust-cell">
                  <div class="cust-avatar" [style.background]="avatarBg(c.initials)">{{ c.initials }}</div>
                  <div class="cust-info">
                    <div class="cust-name">{{ c.name }}</div>
                    <div class="cust-email">{{ c.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" [ngClass]="statusClass(c.status)">
                  <span class="dot"></span>{{ c.status }}
                </span>
              </td>
              <td class="balance-cell">{{ fmtBalance(c.balance) }}</td>
              <td class="joined-cell">{{ c.joinedAgo }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `,
  styles: [`
    .dashboard { display: flex; flex-direction: column; gap: 20px; }

    /* ── Hero banner ─── */
    .hero-banner {
      background: linear-gradient(135deg, #12203a 0%, #1a2f50 60%, #0f3460 100%);
      border-radius: var(--r-xl);
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      position: relative;
      overflow: hidden;
      min-height: 200px;
    }
    .hero-banner::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.12) 0%, transparent 60%);
    }
    .hero-left { flex: 1; position: relative; z-index: 1; }
    .hero-greeting { font-size: 13px; color: rgba(255,255,255,0.55); font-weight: 500; margin-bottom: 6px; }
    .hero-title { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 10px; letter-spacing: -0.5px; }
    .hero-desc { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.6; max-width: 420px; margin-bottom: 24px; }
    .hero-pills { display: flex; gap: 12px; flex-wrap: wrap; }
    .hero-pill {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex; flex-direction: column; gap: 3px;
    }
    .pill-val { font-size: 17px; font-weight: 800; color: #fff; }
    .pill-label { font-size: 11px; color: rgba(255,255,255,0.5); }
    .pill-change { font-size: 11px; font-weight: 700; }
    .pill-change.up { color: #22c55e; }
    .pill-change.down { color: #ef4444; }
    .hero-right { text-align: right; position: relative; z-index: 1; flex-shrink: 0; }
    .hero-rev-label { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 6px; }
    .hero-rev-val { font-size: 30px; font-weight: 800; color: #fff; letter-spacing: -1px; white-space: nowrap; }
    .hero-deco {
      position: absolute; bottom: 0; right: 0;
      width: 200px; height: 130px; opacity: 0.6;
    }

    /* ── Stat grid ─── */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .stat-card {
      background: var(--bg-card);
      border-radius: var(--r-lg);
      border: 1px solid var(--border);
      padding: 20px;
      transition: box-shadow 0.2s;
      &:hover { box-shadow: var(--shadow-md); }
    }
    .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon-inner {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    .stat-change {
      font-size: 12px; font-weight: 700; padding: 4px 8px;
      border-radius: 20px;
      &.up   { background: var(--success-light); color: var(--success); }
      &.down { background: var(--danger-light);  color: var(--danger);  }
    }
    .stat-val { font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.5px; }
    .stat-label { font-size: 13px; color: var(--text-secondary); }

    /* ── Chart cards ─── */
    .chart-card {
      background: var(--bg-card);
      border-radius: var(--r-lg);
      border: 1px solid var(--border);
      padding: 22px;
      transition: background 0.25s, border-color 0.25s;
    }
    .chart-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 18px; gap: 12px;
    }
    .chart-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px; }
    .chart-sub   { font-size: 12px; color: var(--text-secondary); }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 16px;
    }

    .chart-body { position: relative; height: 240px; }
    .chart-canvas { width: 100% !important; height: 100% !important; }

    /* Period tabs */
    .period-tabs { display: flex; gap: 4px; }
    .period-btn {
      padding: 5px 10px; border-radius: 6px; background: transparent;
      border: 1px solid var(--border); font-size: 12px; font-weight: 600;
      color: var(--text-secondary); cursor: pointer; transition: all 0.15s;
      &:hover { background: var(--bg-card-alt); color: var(--text-primary); }
      &.active { background: var(--accent); border-color: var(--accent); color: #fff; }
    }

    /* Donut */
    .donut-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
    .donut-canvas { width: 180px !important; height: 180px !important; }
    .donut-legend { display: flex; flex-direction: column; gap: 10px; }
    .legend-item { display: flex; align-items: center; gap: 8px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .legend-label { flex: 1; font-size: 13px; color: var(--text-secondary); }
    .legend-val { font-size: 13px; font-weight: 700; color: var(--text-primary); }

    /* Bottom row */
    .bottom-row { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }

    .activity-card .chart-body { height: 200px; }
    .chart-legend-row { display: flex; gap: 16px; margin-top: 12px; }
    .legend-pill { font-size: 12px; font-weight: 500; color: var(--c, var(--text-secondary)); }

    /* More btn */
    .more-btn {
      background: transparent; border: none; color: var(--text-tertiary);
      font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px;
      &:hover { background: var(--bg-card-alt); }
    }

    /* Security alerts */
    .alerts-badge {
      background: var(--danger-light); color: var(--danger);
      font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;
    }
    .alerts-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; }
    .alert-item { display: flex; align-items: center; gap: 12px; }
    .alert-icon {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
      &.alert-icon-high   { background: var(--danger-light);  }
      &.alert-icon-medium { background: var(--warning-light); }
      &.alert-icon-low    { background: var(--accent-light);  }
    }
    .alert-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .alert-info  { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
    .view-alerts-link {
      display: block; text-align: center; font-size: 13px; font-weight: 600;
      color: var(--accent); text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    /* Recent customers table */
    .customers-table-card { padding: 22px 0; }
    .customers-table-card .chart-header { padding: 0 22px; }
    .view-all-link {
      font-size: 13px; font-weight: 600; color: var(--accent);
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }
    .customers-table {
      width: 100%; border-collapse: collapse;
      th {
        text-align: left; padding: 10px 22px;
        font-size: 11px; font-weight: 700; color: var(--text-tertiary);
        text-transform: uppercase; letter-spacing: 0.8px;
        border-bottom: 1px solid var(--border);
      }
      td {
        padding: 16px 22px;
        border-bottom: 1px solid var(--border-light);
        font-size: 13px;
        &:last-child { border-bottom: none; }
      }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: var(--bg-card-alt); }
    }
    .cust-cell { display: flex; align-items: center; gap: 12px; }
    .cust-avatar {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .cust-name  { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .cust-email { font-size: 12px; color: var(--text-tertiary); }
    .balance-cell { font-weight: 700; color: var(--text-primary); }
    .joined-cell  { color: var(--text-tertiary); }

    /* Responsive */
    @media (max-width: 1200px) {
      .stat-grid { grid-template-columns: repeat(2, 1fr); }
      .charts-row, .bottom-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .hero-banner { flex-direction: column; }
      .stat-grid { grid-template-columns: 1fr 1fr; }
    }
  `],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private data = inject(DataService);
  theme = inject(ThemeService);

  @ViewChild('revenueCanvas') revenueCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutCanvas')   donutCanvas!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('weeklyCanvas')  weeklyCanvas!:  ElementRef<HTMLCanvasElement>;

  stats: StatCard[] = [];
  recentCustomers: Customer[] = [];
  accountTypes: { label: string; value: number; color: string }[] = [];
  alerts: any[] = [];
  revPeriod = signal('1y');

  activeUsersCount = signal(0);
  totalRevenue = signal(0);
  pendingAccountsCount = signal(0);

  avatarColors = ['#1e3a6e','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2','#be185d','#059669'];

  private charts: any[] = [];

  ngOnInit() {
    this.fetchDashboardData();
    this.alerts = this.data.getSecurityAlerts();
    this.accountTypes = this.data.getAccountTypes();
  }

  fetchDashboardData() {
    this.data.getGlobalStats().subscribe({
      next: (res: any) => {
        this.activeUsersCount.set(res.activeUsers);
        this.totalRevenue.set(res.totalRevenue);
        this.pendingAccountsCount.set(res.pendingAccounts);
        
        this.stats = [
          { icon: '💳', iconBg: '#22c55e', label: 'Total Revenue',  value: this.fmtBalance(res.totalRevenue), change: '↑ Live', changeUp: true },
          { icon: '👥', iconBg: '#3b82f6', label: 'Active Users',   value: String(res.activeUsers),           change: '↑ Live',  changeUp: true },
          { icon: '↔',  iconBg: '#8b5cf6', label: 'Transactions',   value: String(res.transactions),           change: '—',  changeUp: true },
          { icon: '⏳', iconBg: '#f59e0b', label: 'Pending Apps',   value: String(res.pendingAccounts),        change: 'Attention',  changeUp: false },
        ];
      }
    });

    this.data.getCustomers().subscribe({
      next: (users: any[]) => {
        this.recentCustomers = users.slice(0, 5).map(u => {
           const initials = u.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
           const accounts = u.accounts || [];
           const totalBalance = accounts.reduce((acc: number, curr: any) => acc + (curr.balance || 0), 0);
           return {
              id: u.id, initials, name: u.fullName, email: u.email || 'N/A', phone: u.phoneNumber, nationalId: u.nationalId || 'N/A',
              status: u.status || 'Active', balance: totalBalance, accounts: accounts.length, cards: 0, joined: '', 
              joinedAgo: new Date(u.createdAt).toLocaleDateString(),
           } as Customer;
        });
      }
    });
  }

  ngAfterViewInit() {
    this.drawRevenueChart();
    this.drawDonutChart();
    this.drawWeeklyChart();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c?.destroy?.());
  }

  private isDarkMode(): boolean { return this.theme.isDark(); }

  private gridColor()   { return this.isDarkMode() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }
  private tickColor()   { return this.isDarkMode() ? 'rgba(255,255,255,0.4)'  : '#9ca3af'; }
  private tooltipBg()   { return this.isDarkMode() ? '#1e2435' : '#ffffff'; }
  private tooltipText() { return this.isDarkMode() ? '#f9fafb' : '#0d1117'; }

  private drawRevenueChart() {
    const rev   = this.data.getRevenueData();
    const ctx   = this.revenueCanvas.nativeElement.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0,   'rgba(20,184,166,0.3)');
    gradient.addColorStop(1,   'rgba(20,184,166,0)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: rev.labels,
        datasets: [{
          data: rev.values,
          borderColor: '#14b8a6',
          borderWidth: 2.5,
          fill: true,
          backgroundColor: gradient,
          tension: 0.45,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#14b8a6',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.tooltipBg(),
            titleColor: this.tooltipText(),
            bodyColor: this.tooltipText(),
            borderColor: this.gridColor(),
            borderWidth: 1,
            padding: 10,
            callbacks: { label: (ctx: any) => `${ctx.parsed.y}M XAF` },
          },
        },
        scales: {
          x: {
            grid: { color: this.gridColor() },
            ticks: { color: this.tickColor(), font: { size: 11 } },
          },
          y: {
            grid: { color: this.gridColor() },
            ticks: {
              color: this.tickColor(), font: { size: 11 },
              callback: (v: any) => v + 'M',
            },
            min: 0,
          },
        },
      },
    });
    this.charts.push(chart);
  }

  private drawDonutChart() {
    const ctx   = this.donutCanvas.nativeElement.getContext('2d')!;
    const types = this.accountTypes;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: types.map(t => t.label),
        datasets: [{
          data: types.map(t => t.value),
          backgroundColor: types.map(t => t.color),
          borderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.tooltipBg(),
            titleColor: this.tooltipText(),
            bodyColor: this.tooltipText(),
            borderColor: this.gridColor(),
            borderWidth: 1,
            padding: 10,
            callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.parsed}%` },
          },
        },
      },
    });
    this.charts.push(chart);
  }

  private drawWeeklyChart() {
    const w     = this.data.getWeeklyActivity();
    const ctx   = this.weeklyCanvas.nativeElement.getContext('2d')!;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: w.labels,
        datasets: [
          { label: 'Deposits',     data: w.deposits,    backgroundColor: '#14b8a6', borderRadius: 4, borderSkipped: false, barPercentage: 0.6, categoryPercentage: 0.7 },
          { label: 'Withdrawals',  data: w.withdrawals, backgroundColor: '#3b82f6', borderRadius: 4, borderSkipped: false, barPercentage: 0.6, categoryPercentage: 0.7 },
          { label: 'Transfers',    data: w.transfers,   backgroundColor: '#f59e0b', borderRadius: 4, borderSkipped: false, barPercentage: 0.6, categoryPercentage: 0.7 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.tooltipBg(),
            titleColor: this.tooltipText(),
            bodyColor: this.tooltipText(),
            borderColor: this.gridColor(),
            borderWidth: 1,
            padding: 10,
            callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}M XAF` },
          },
        },
        scales: {
          x: {
            stacked: false,
            grid: { display: false },
            ticks: { color: this.tickColor(), font: { size: 11 } },
          },
          y: {
            grid: { color: this.gridColor() },
            ticks: {
              color: this.tickColor(), font: { size: 11 },
              callback: (v: any) => v + 'M',
            },
          },
        },
      },
    });
    this.charts.push(chart);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'Active':       'badge-success',
      'Pending':      'badge-warning',
      'Frozen':       'badge-danger',
      'Under Review': 'badge-review',
    };
    return map[status] || 'badge-accent';
  }

  avatarBg(initials: string): string {
    const i = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % this.avatarColors.length;
    return this.avatarColors[i];
  }

  fmtBalance(n: number): string {
    return n.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' XAF';
  }
}
