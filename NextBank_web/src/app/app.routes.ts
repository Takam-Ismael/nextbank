import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
        import('./features/layout/shell.component').then(m => m.ShellComponent),

    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },

      {
        path: 'overview',
        loadComponent: () =>
            import('./features/dashboard/dashboard.component')
                .then(m => m.DashboardComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
            import('./features/customers/customers.component')
                .then(m => m.CustomersComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
            import('./features/transactions/transactions.component')
                .then(m => m.TransactionsComponent),
      },

      {
        path: 'compliance',
        loadComponent: () =>
            import('./features/compliance/compliance.component')
                .then(m => m.ComplianceComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
            import('./features/notifications/notifications.component')
                .then(m => m.NotificationsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
            import('./features/settings/settings.component')
                .then(m => m.SettingsComponent),
      },
    ],
  },
];