import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DirectoryService } from 'src/app/service/directory.service';
import { ImageService } from 'src/app/service/image.service';
import { ImageData } from 'src/app/model/ImageData';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-gallery-view',
    templateUrl: './gallery-view.component.html',
    styleUrls: ['./gallery-view.component.scss'],
})
export class GalleryViewComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;
    private currDirSub = Subscription.EMPTY;
    private imgNumberSub = Subscription.EMPTY;

    imagesData: ImageData[] = [];
    imagesNumber = 0;
    currentPage = 0;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];

    constructor(
        private directoryService: DirectoryService,
        private imageService: ImageService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.imagesSub = this.imageService.imagesData.subscribe({
            next: (data) => {
                this.imagesData = data;
                this.cdr.detectChanges();
            },
        });

        this.currDirSub = this.directoryService.currentDirectory.subscribe({
            next: (dir) => {
                this.imageService.getImagesNumber(dir);
            },
        });

        this.imgNumberSub = this.imageService.imagesNumber.subscribe({
            next: (value) => {
                this.imagesNumber = value;
                this.getImagesPage();
            },
        });
    }

    ngOnDestroy(): void {
        this.imagesSub.unsubscribe();
        this.currDirSub.unsubscribe();
        this.imgNumberSub.unsubscribe();
    }

    pageChange(ev: PageEvent): void {
        this.currentPage = ev.pageIndex;
        this.pageSize = ev.pageSize;
        this.getImagesPage();
    }

    getImagesPage(): void {
        const dir = this.directoryService.currentDirectory.value;
        this.imageService.getImagesPage(dir, this.currentPage, this.pageSize);
    }
}
