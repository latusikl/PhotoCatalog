import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SettingsComponent } from './components/settings/settings.component';
import { DirectoryService } from './service/directory.service';
import { ImageService } from './service/image.service';
import { SettingsService } from './service/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'photo-catalog';

    private currDirSub = Subscription.EMPTY;
    private dirSettingsSub = Subscription.EMPTY;

    constructor(
        private directoryService: DirectoryService,
        private imageService: ImageService,
        private ngZone: NgZone,
        private settingsService: SettingsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.currDirSub = this.directoryService.currentDirectory.subscribe({
            next: (dir) => {
                this.ngZone.run(() => {
                    this.imageService.getImages(dir);
                });
            },
        });
        this.dirSettingsSub = this.settingsService.settings.subscribe({
            next: (dir) => {
                if (!!dir.defaultDir) {
                    this.directoryService.currentDirectory.next(dir.defaultDir);
                }
            },
        });
    }

    ngOnDestroy(): void {
        this.currDirSub.unsubscribe();
        this.dirSettingsSub.unsubscribe();
    }

    chooseFolder(): void {
        this.directoryService.callForDirectoryChoice();
    }

    openSettingsDialog(): void {
        this.dialog.open(SettingsComponent, { disableClose: true });
    }
}
