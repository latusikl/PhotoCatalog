import { ChangeDetectorRef, Component, HostBinding, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DirectoryService } from 'src/app/service/directory.service';
import { ImageService } from 'src/app/service/image.service';
import { ImageData } from 'src/app/model/ImageData';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { GallerySearchCriteria } from 'src/app/model/GallerySearchCriteria';

@Component({
    selector: 'app-gallery-view',
    templateUrl: './gallery-view.component.html',
    styleUrls: ['./gallery-view.component.scss'],
})
export class GalleryViewComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;
    private currDirSub = Subscription.EMPTY;
    private imgNumberSub = Subscription.EMPTY;

    searchCriteria = <GallerySearchCriteria>{};
    imagesData: ImageData[] = [];
    imagesNumber = 0;
    currentPage = 0;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];

    @HostBinding('class')
    class = 'view';

    constructor(
        private directoryService: DirectoryService,
        private imageService: ImageService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private ngZone: NgZone,
    ) {}

    ngOnInit(): void {
        this.imagesSub = this.imageService.imagesData.subscribe({
            next: (data) => {
                this.imagesNumber = data.length;
                this.getImagesPage(data);
                this.cdr.detectChanges();
            },
        });

        this.currDirSub = this.directoryService.currentDirectory.subscribe({
            next: (dir) => {
                this.imageService.getImages(dir);
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
        const allImgs = this.imageService.imagesData.value;
        this.getImagesPage(allImgs);
    }

    getImagesPage(allImgs: ImageData[]): void {
        const start = this.currentPage * this.pageSize;
        this.imagesData = allImgs.slice(start, start + this.pageSize);
    }

    filterImages(): void {
        this.currentPage = 0;
        const allImgs = this.imageService.imagesData.value;
        this.getImagesPage(allImgs);
        this.imagesData = this.imagesData.filter((img) => {
            if (!!this.searchCriteria.name) {
                return img.name.toLocaleLowerCase().includes(this.searchCriteria.name?.toLocaleLowerCase());
            }
            return true;
        });
        this.imagesNumber = this.imagesData.length;
    }

    navigateToSinglePictureView(imgData: ImageData): void {
        this.ngZone.run(() => this.router.navigate(['/exif'], { state: { imgData: imgData } }));
    }
}
