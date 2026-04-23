import { Component } from '@angular/core';
import { ComplianceService } from '../../core/services/compliance.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'nb-compliance',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './compliance.component.html'
})
export class ComplianceComponent {

    alerts = this.service.getAlerts();

    constructor(private service: ComplianceService) {}

    approve(a: any) {
        this.service.updateStatus(a, 'Approved');
    }

    reject(a: any) {
        this.service.updateStatus(a, 'Rejected');
    }
}