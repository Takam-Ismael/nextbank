import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {

    settings = {
        darkMode: false,
        email: true
    };

    get() {
        return this.settings;
    }

    update(s: any) {
        this.settings = s;
    }
}