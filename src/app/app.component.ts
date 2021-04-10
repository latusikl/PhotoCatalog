import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DirectoryService } from './service/directory.service';
import { ImageService } from './service/image.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'photo-catalog';

    private currDirSub = Subscription.EMPTY;

    constructor(
        private directoryService: DirectoryService,
        private imageService: ImageService,
        private ngZone: NgZone,
    ) {}

    ngOnInit(): void {
        this.currDirSub = this.directoryService.currentDirectory.subscribe({
            next: (dir) => {
                this.ngZone.run(() => {
                    this.imageService.getImages(dir);
                });
            },
        });
    }

    ngOnDestroy(): void {
        this.currDirSub.unsubscribe();
    }

    chooseFolder(): void {
        this.directoryService.callForDirectoryChoice();
    }
}
