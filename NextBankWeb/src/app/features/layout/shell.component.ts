import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

interface NavItem {
  path: string;
  label: string;
  icon: string; // full svg content
}

@Component({
  selector: 'nb-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  template: `
    <div class="shell" [class.collapsed]="sidebarCollapsed()">

      <!-- ── SIDEBAR ──────────────────────────────────────── -->
      <aside class="sidebar">
        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-icon">
            <!-- Building/bank icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="9" width="18" height="13" rx="1"/>
              <path d="M3 9l9-6 9 6"/>
              <rect x="9" y="13" width="6" height="9"/>
            </svg>
          </div>
          <div class="logo-text" *ngIf="!sidebarCollapsed()">
            <div class="logo-name">NextBank</div>
            <div class="logo-role">ADMIN</div>
          </div>
        </div>

        <!-- Nav items -->
        <nav class="sidebar-nav">
          <a *ngFor="let item of navItems"
             [routerLink]="item.path"
             routerLinkActive="active"
             class="nav-item">
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            <span class="nav-label" *ngIf="!sidebarCollapsed()">{{ item.label }}</span>
            <span class="active-dot" *ngIf="!sidebarCollapsed()"></span>
          </a>
        </nav>

        <!-- Collapse toggle -->
        <button class="collapse-btn" (click)="toggleSidebarCollapsed()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path [attr.d]="sidebarCollapsed() ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'"/>
          </svg>
        </button>

        <!-- Footer -->
        <div class="sidebar-footer">
          <div class="admin-profile" *ngIf="!sidebarCollapsed()">
            <div class="admin-avatar">A</div>
            <div class="admin-info">
              <div class="admin-name">Admin User</div>
              <div class="admin-email">admin&#64;nextbank.cm</div>
            </div>
          </div>
          <div class="admin-avatar-only" *ngIf="sidebarCollapsed()">A</div>
          <button class="logout-btn" *ngIf="!sidebarCollapsed()" (click)="logout()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Log out
          </button>
        </div>
      </aside>

      <!-- ── MAIN AREA ─────────────────────────────────────── -->
      <div class="main-area">

        <!-- Top bar -->
        <header class="topbar">
          <div class="search-wrap">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input class="search-input" type="text" placeholder="Search customers, transactions..." [(ngModel)]="searchQuery"/>
          </div>

          <div class="topbar-actions">
            <button class="icon-btn" title="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="notif-badge">5</span>
            </button>
            <button class="icon-btn theme-toggle" (click)="theme.toggle()" [title]="theme.isDark() ? 'Light mode' : 'Dark mode'">
              <svg *ngIf="theme.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <svg *ngIf="!theme.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
          </div>
        </header>

        <main class="page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell { display: flex; height: 100vh; overflow: hidden; background: var(--bg-page); }

    /* ── Sidebar ─── */
    .sidebar {
      width: 230px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: relative;
      transition: width 0.25s ease, background 0.25s, border-color 0.25s;
      z-index: 100;
    }
    .shell.collapsed .sidebar { width: 64px; }

    :host-context([data-theme="dark"]) .sidebar {
      background: #161b27;
      border-right-color: #2a3241;
    }
    :host-context([data-theme="dark"]) .sidebar-logo {
      border-bottom-color: #2a3241;
    }
    :host-context([data-theme="dark"]) .logo-name { color: #f9fafb; }
    :host-context([data-theme="dark"]) .logo-role { color: rgba(255,255,255,0.35); }
    :host-context([data-theme="dark"]) .nav-item {
      color: rgba(255,255,255,0.55);
    }
    :host-context([data-theme="dark"]) .nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: #fff;
    }
    :host-context([data-theme="dark"]) .nav-item.active {
      background: #1e40af;
      color: #fff;
    }
    :host-context([data-theme="dark"]) .collapse-btn {
      background: #161b27;
      border-color: rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.5);
    }
    :host-context([data-theme="dark"]) .collapse-btn:hover {
      background: #1e2d4a;
      color: #fff;
    }
    :host-context([data-theme="dark"]) .sidebar-footer {
      border-top-color: #2a3241;
    }
    :host-context([data-theme="dark"]) .admin-name { color: #f9fafb; }
    :host-context([data-theme="dark"]) .admin-email { color: rgba(255,255,255,0.35); }
    :host-context([data-theme="dark"]) .logout-btn { color: #f87171; }
    :host-context([data-theme="dark"]) .logout-btn:hover { background: rgba(239,68,68,0.12); }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 22px 18px 18px;
      border-bottom: 1px solid #f0f0f0;
    }
    .logo-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: #e8edf5;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .logo-name { font-size: 15px; font-weight: 800; color: #0d1117; line-height: 1.2; }
    .logo-role { font-size: 9px; font-weight: 700; color: #9ca3af; letter-spacing: 1.5px; }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 10px;
      color: #6b7280;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s;
      position: relative;
      white-space: nowrap;
      overflow: hidden;

      &:hover { background: #f3f4f6; color: #0d1117; }

      &.active {
        background: #1e3a6e;
        color: #ffffff;
        font-weight: 600;
      }

      .active-dot {
        display: none;
        width: 7px; height: 7px;
        border-radius: 50%;
        background: #ffffff;
        margin-left: auto;
        flex-shrink: 0;
      }
      &.active .active-dot { display: block; }
    }
    .nav-icon {
      flex-shrink: 0; width: 20px; height: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .nav-label { flex: 1; }

    .collapse-btn {
      position: absolute;
      top: 24px; right: -13px;
      width: 26px; height: 26px;
      border-radius: 50%;
      background: #ffffff;
      border: 1.5px solid #e5e7eb;
      color: #6b7280;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.15s;
      z-index: 10;
      &:hover { background: #f3f4f6; color: #0d1117; }
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
    }
    .admin-profile { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .admin-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: #f59e0b;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .admin-avatar-only {
      width: 36px; height: 36px; border-radius: 50%;
      background: #f59e0b;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff;
      margin: 0 auto 12px;
    }
    .admin-name { font-size: 13px; font-weight: 700; color: #0d1117; }
    .admin-email { font-size: 11px; color: #9ca3af; }
    .logout-btn {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 8px 10px;
      border-radius: 8px; background: transparent;
      color: #ef4444; font-size: 13px; font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
      &:hover { background: rgba(239,68,68,0.08); }
    }

    /* ── Main area ─── */
    .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    .topbar {
      height: 56px;
      background: var(--topbar-bg);
      border-bottom: 1px solid var(--topbar-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      gap: 20px;
      flex-shrink: 0;
    }

    .search-wrap {
      display: flex; align-items: center; gap: 10px;
      flex: 1; max-width: 420px;
      background: var(--bg-input);
      border-radius: 20px;
      padding: 0 16px; height: 36px;
      border: 1px solid var(--border);
      transition: border-color 0.15s;
      &:focus-within { border-color: var(--accent); }
    }
    .search-icon { color: var(--text-tertiary); flex-shrink: 0; }
    .search-input {
      flex: 1; background: transparent; border: none;
      font-size: 13px; color: var(--text-primary);
      &::placeholder { color: var(--text-tertiary); }
    }

    .topbar-actions { display: flex; align-items: center; gap: 8px; }
    .icon-btn {
      position: relative;
      width: 36px; height: 36px;
      border-radius: 50%;
      background: transparent;
      border: none;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-secondary);
      cursor: pointer;
      transition: background 0.15s;
      &:hover { background: var(--bg-input); }
    }
    .notif-badge {
      position: absolute; top: 2px; right: 2px;
      width: 14px; height: 14px; border-radius: 50%;
      background: #ef4444;
      color: #fff; font-size: 8px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }

    :host-context([data-theme="dark"]) .logo-icon {
      background: #1e2d4a;
    }
    :host-context([data-theme="dark"]) .logo-icon svg { stroke: #60a5fa; }

    .page-content { flex: 1; overflow-y: auto; padding: 24px; }
  `],
})
export class ShellComponent {
  toggleSidebarCollapsed() { this.sidebarCollapsed.update((v: boolean) => !v); }
  theme = inject(ThemeService);
  sidebarCollapsed = signal(false);
  searchQuery = '';
  private router = inject(Router);

  logout() {
    localStorage.removeItem('admin_token');
    this.router.navigate(['/login']);
  }

  navItems: NavItem[] = [
    {
      path: '/overview', label: 'Overview',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
    },
    {
      path: '/customers', label: 'Customers',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      path: '/transactions', label: 'Transactions',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4 4 4"/><path d="M17 8v12m0 0 4-4m-4 4-4-4"/></svg>`
    },
    {
      path: '/cards', label: 'Cards',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
    },
    {
      path: '/analytics', label: 'Analytics',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
    },
    {
      path: '/compliance', label: 'Compliance',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    },
    {
      path: '/notifications', label: 'Notifications',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
    },
    {
      path: '/settings', label: 'Settings',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
    },
  ];
}
