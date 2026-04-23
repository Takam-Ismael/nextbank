import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    notifications: any[] = [];

    getAll() {
        return this.notifications;
    }

    add(n: any) {
        this.notifications.push(n);
    }
}