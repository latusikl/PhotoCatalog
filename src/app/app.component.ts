import { Component } from '@angular/core';
import { DirectoryService } from './service/directory.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'photo-catalog';
    isExpanded = true;

    constructor(private directoryService: DirectoryService) {}

    toggleMenu(): void {
        this.isExpanded = !this.isExpanded;
    }

    chooseFolder(): void {
        this.directoryService.callForDirectoryChoice();
    }
}
