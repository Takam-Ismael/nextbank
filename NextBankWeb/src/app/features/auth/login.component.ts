import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'nb-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="login-wrapper">
      <div class="login-container">
        <div class="login-header">
          <div class="brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            NextBank
          </div>
          <h1>Admin Portal</h1>
          <p>Sign in to manage the NextBank platform.</p>
        </div>

        <form class="login-form" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="username" name="username" required placeholder="Enter admin username" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </div>

          <div class="error-msg" *ngIf="errorMsg()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ errorMsg() }}
          </div>

          <button type="submit" class="btn-login" [disabled]="loading()">
            {{ loading() ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
      </div>
      
      <div class="hero-deco">
        <svg viewBox="0 0 120 80" fill="none">
          <path d="M0 60 C20 50 30 30 50 25 C70 20 90 35 120 10" stroke="rgba(59, 130, 246, 0.4)" stroke-width="2" fill="none"/>
          <path d="M0 60 C20 50 30 30 50 25 C70 20 90 35 120 10 L120 80 L0 80Z" fill="rgba(59, 130, 246, 0.05)"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0d1117; /* Dark background from the dashboard theme */
      position: relative;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    
    .login-wrapper::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.1) 0%, transparent 60%);
      z-index: 0;
    }

    .login-container {
      background: #1e2435;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      position: relative;
      z-index: 1;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .brand {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 20px; font-weight: 800; color: #fff;
      margin-bottom: 20px;
      color: #3b82f6;
    }

    .login-header h1 {
      font-size: 24px; font-weight: 800; color: #f9fafb; margin-bottom: 8px;
    }
    .login-header p {
      font-size: 14px; color: #9ca3af;
    }

    .form-group {
      display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
    }
    
    .form-group label {
      font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;
    }
    
    .form-group input {
      height: 44px; padding: 0 14px;
      background: #0d1117;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: #f9fafb; font-size: 14px;
      transition: all 0.2s;
    }
    .form-group input:focus {
      border-color: #3b82f6; outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
    }

    .btn-login {
      width: 100%; height: 46px; border-radius: 10px;
      background: #3b82f6; color: #fff;
      font-size: 14px; font-weight: 600; border: none; cursor: pointer;
      margin-top: 10px; transition: background 0.2s;
    }
    .btn-login:hover:not(:disabled) { background: #2563eb; }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

    .error-msg {
      display: flex; align-items: center; gap: 8px;
      padding: 12px; border-radius: 8px;
      background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.2);
      color: #ef4444; font-size: 13px; font-weight: 500;
      margin-bottom: 16px;
    }

    .hero-deco {
      position: absolute; bottom: 0; right: 0; left: 0;
      height: 200px; opacity: 0.6; pointer-events: none;
      z-index: 0;
    }
    .hero-deco svg { width: 100%; height: 100%; preserveAspectRatio: none; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  
  loading = signal(false);
  errorMsg = signal('');
  
  private router = inject(Router);
  private http = inject(HttpClient);

  onLogin() {
    if (!this.username || !this.password) return;
    
    this.loading.set(true);
    this.errorMsg.set('');

    this.http.post<any>('http://localhost:8085/api/accounts/auth/admin-login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('admin_token', res.token);
        this.router.navigate(['/overview']);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Invalid credentials. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
