import { Component } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

@Component({
    selector: 'nb-notifications',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule],
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent {

    notifications = this.service.getAll();

    newNotif = { title: '', message: '' };

    constructor(private service: NotificationService) {}

    send() {
        this.service.add({...this.newNotif});
        this.newNotif = { title: '', message: '' };
    }
}