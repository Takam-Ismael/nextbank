import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComplianceService {

    alerts = [
        { id: 1, name: 'John', risk: 'High', status: 'Pending' }
    ];

    getAlerts() {
        return this.alerts;
    }

    updateStatus(alert: any, status: string) {
        alert.status = status;
    }
}