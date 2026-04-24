import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'nb-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  theme = inject(ThemeService);

  // Service URLs (read-only display)
  services = [
    { name: 'Accounts Service',      port: 8084, url: 'http://localhost:8084', status: 'unknown' },
    { name: 'Cards Service',          port: 8086, url: 'http://localhost:8086', status: 'unknown' },
    { name: 'Notifications Service',  port: 8087, url: 'http://localhost:8087', status: 'unknown' },
  ];

  saved = false;

  saveTheme() {
    this.saved = true;
    setTimeout(() => this.saved = false, 2000);
  }
}
