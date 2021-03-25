import { ChangeDetectorRef, Component, HostBinding, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DirectoryService } from 'src/app/service/directory.service';
import { ImageService } from 'src/app/service/image.service';
import { ImageData } from 'src/app/model/ImageData';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GallerySearchCriteria } from 'src/app/model/GallerySearchCriteria';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Component({
    selector: 'app-gallery-view',
    templateUrl: './gallery-view.component.html',
    styleUrls: ['./gallery-view.component.scss'],
})
export class GalleryViewComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;
    private currDirSub = Subscription.EMPTY;
    private imgNumberSub = Subscription.EMPTY;
    private exposureTimeSub = Subscription.EMPTY;

    criteriaForm: FormGroup;
    imagesData: ImageData[] = [];
    imagesNumber = 0;
    currentPage = 0;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];
    maxExposureTime = 8000;
    noImages = true;

    @HostBinding('class')
    class = 'view';

    constructor(
        private directoryService: DirectoryService,
        private imageService: ImageService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private ngZone: NgZone,
        fb: FormBuilder,
    ) {
        this.criteriaForm = fb.group({
            name: '',
            startDate: null,
            endDate: null,
            allowEmptyData: false,
            minFocalLength: 0,
            minFNumber: 0,
            minExposureTime: [0, [Validators.min(0), Validators.max(8000)]],
            isExposureTimeInteger: false,
        });
    }

    ngOnInit(): void {
        this.imagesSub = this.imageService.imagesData.subscribe({
            next: (data) => {
                this.imagesNumber = data.length;
                this.noImages = !data.length;
                this.getImagesPage(data);
                this.cdr.detectChanges();
            },
        });

        this.currDirSub = this.directoryService.currentDirectory.subscribe({
            next: (dir) => {
                this.imageService.getImages(dir);
            },
        });

        this.exposureTimeSub = this.criteriaForm.controls.isExposureTimeInteger.valueChanges.subscribe({
            next: (value) => this.onIsExposureTimeIntegerChange(value),
        });
    }

    ngOnDestroy(): void {
        this.imagesSub.unsubscribe();
        this.currDirSub.unsubscribe();
        this.imgNumberSub.unsubscribe();
        this.exposureTimeSub.unsubscribe();
    }

    pageChange(ev: PageEvent): void {
        this.currentPage = ev.pageIndex;
        this.pageSize = ev.pageSize;
        const allImgs = this.imageService.imagesData.value;
        this.getImagesPage(allImgs);
    }

    onIsExposureTimeIntegerChange(value: boolean): void {
        this.maxExposureTime = value ? 40 : 8000;
        if (this.criteriaForm.controls.minExposureTime.value > this.maxExposureTime) {
            this.criteriaForm.controls.minExposureTime.setValue(this.maxExposureTime);
        }
    }

    getImagesPage(allImgs: ImageData[]): void {
        const start = this.currentPage * this.pageSize;
        this.imagesData = allImgs.slice(start, start + this.pageSize);
    }

    filterImages(): void {
        this.currentPage = 0;
        const allImgs = this.imageService.imagesData.value;
        this.getImagesPage(allImgs);
        this.imagesData = this.imagesData.filter((img) => this.imageFilterFunc(img));
        this.imagesNumber = this.imagesData.length;
    }

    imageFilterFunc(img: ImageData): boolean {
        const { name, startDate, endDate, allowEmptyData, minFocalLength, minFNumber, isExposureTimeInteger } = this
            .criteriaForm.value as GallerySearchCriteria;
        let { minExposureTime } = this.criteriaForm.value as GallerySearchCriteria;
        let passed = true;
        if (!!name) {
            // filter by name
            passed = img.name.toLocaleLowerCase().includes(name?.toLocaleLowerCase());
        }
        if (passed && !!startDate) {
            // filter by start date
            if (!!img.dateTimeOriginal) {
                passed = dayjs(img.dateTimeOriginal).isSameOrAfter(startDate);
            } else if (!allowEmptyData) {
                passed = false;
            }
        }
        if (passed && !!endDate) {
            // filter by end date
            if (!!img.dateTimeOriginal) {
                passed = dayjs(img.dateTimeOriginal).isSameOrBefore(endDate);
            } else if (!allowEmptyData) {
                passed = false;
            }
        }
        if (passed && !!minFocalLength) {
            // filter by min focal length
            if (!!img.focalLength) {
                passed = img.focalLength >= minFocalLength;
            } else if (!allowEmptyData) {
                passed = false;
            }
        }
        if (passed && !!minFNumber) {
            // filter by min fnumber
            if (!!img.fNumber) {
                passed = img.fNumber >= minFNumber;
            } else if (!allowEmptyData) {
                passed = false;
            }
        }
        if (passed && !!minExposureTime) {
            // filter by min fnumber
            if (!!img.exposureTime) {
                if (!isExposureTimeInteger) {
                    minExposureTime = 1 / minExposureTime;
                }
                passed = img.exposureTime >= minExposureTime;
            } else if (!allowEmptyData) {
                passed = false;
            }
        }
        return passed;
    }

    navigateToSinglePictureView(imgData: ImageData): void {
        this.ngZone.run(() => this.router.navigate(['/exif'], { state: { imgData: imgData } }));
    }
}
