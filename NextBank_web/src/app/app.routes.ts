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
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customers.component').then(m => m.CustomersComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./transactions/transactions.component').then(m => m.TransactionsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
