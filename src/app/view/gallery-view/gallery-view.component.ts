import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DirectoryService } from 'src/app/service/directory.service';
import { ImageService } from 'src/app/service/image.service';

@Component({
    selector: 'app-gallery-view',
    templateUrl: './gallery-view.component.html',
    styleUrls: ['./gallery-view.component.scss'],
})
export class GalleryViewComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;
    private currDirSub = Subscription.EMPTY;

    images: string[] = [];

    constructor(private directoryService: DirectoryService, private imageService: ImageService) {}

    ngOnInit(): void {
        this.imagesSub = this.imageService.images.subscribe({
            next: (images) => {
                this.images = images;
            },
        });

        this.currDirSub = this.directoryService.currentDirectory.subscribe({
            next: (dir) => {
                this.imageService.getImagesFromLocation(dir);
            },
        });
    }

    ngOnDestroy(): void {
        this.imagesSub.unsubscribe();
        this.currDirSub.unsubscribe();
    }
}
