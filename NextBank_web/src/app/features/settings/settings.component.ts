import { Component } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'nb-settings',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './settings.component.html'
})
export class SettingsComponent {

    settings = this.service.get();

    constructor(private service: SettingsService) {}

    save() {
        this.service.update(this.settings);
        alert('Saved!');
    }
}