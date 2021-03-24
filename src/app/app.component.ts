import { Component } from '@angular/core';
import { DirectoryService } from './service/directory.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'photo-catalog';

    constructor(private directoryService: DirectoryService) {}

    chooseFolder(): void {
        this.directoryService.callForDirectoryChoice();
    }
}
