import { Component, HostBinding, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/service/image.service';
import { ImageData } from 'src/app/model/ImageData';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GallerySearchCriteria } from 'src/app/model/GallerySearchCriteria';
import { MatSelectChange } from '@angular/material/select';
import { SortField } from 'src/app/model/SortField';
import { Resolutions } from 'src/app/model/Resolutions';

type ImageDataProp = string | number | Date;

@Component({
    selector: 'app-gallery-view',
    templateUrl: './gallery-view.component.html',
    styleUrls: ['./gallery-view.component.scss'],
})
export class GalleryViewComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;
    private imgNumberSub = Subscription.EMPTY;
    private exposureTimeSub = Subscription.EMPTY;

    readonly Resolutions = Resolutions;

    criteriaForm: FormGroup;
    imagesData: ImageData[] = [];
    imagesNumber = 0;
    currentPage = 0;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];
    maxExposureTime = 8000;
    noImages = true;
    sortFields: SortField[];
    sortAsc = true;
    sortField?: SortField;

    @HostBinding('class')
    class = 'view';

    constructor(private imageService: ImageService, private router: Router, private ngZone: NgZone, fb: FormBuilder) {
        this.criteriaForm = fb.group({
            name: '',
            startDate: null,
            endDate: null,
            allowEmptyData: false,
            minFocalLength: 0,
            minFNumber: 0,
            minExposureTime: [0, [Validators.min(0), Validators.max(8000)]],
            isExposureTimeInteger: false,
            resolution: null,
        });

        this.sortFields = [
            { name: '-' },
            { name: 'Date', field: 'dateTimeOriginal' },
            { name: 'Name', field: 'name' },
            { name: 'Exposure time', field: 'exposureTime' },
            { name: 'F number', field: 'fNumber' },
            { name: 'Focal length', field: 'focalLength' },
            { name: 'Resolution', field: 'resolution' },
        ];
    }

    ngOnInit(): void {
        this.imagesSub = this.imageService.imagesData.subscribe({
            next: (data) =>
                this.ngZone.run(() => {
                    this.noImages = !data.length;
                    this.search();
                }),
        });

        this.exposureTimeSub = this.criteriaForm.controls.isExposureTimeInteger.valueChanges.subscribe({
            next: (value) => this.onIsExposureTimeIntegerChange(value),
        });
    }

    ngOnDestroy(): void {
        this.imagesSub.unsubscribe();
        this.imgNumberSub.unsubscribe();
        this.exposureTimeSub.unsubscribe();
    }

    pageChange(ev: PageEvent): void {
        this.currentPage = ev.pageIndex;
        this.pageSize = ev.pageSize;
        this.search();
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

    filterImages(allImgs: ImageData[]): ImageData[] {
        return allImgs.filter((img) => this.imageFilterFunc(img));
    }

    imageFilterFunc(img: ImageData): boolean {
        const {
            name,
            startDate,
            endDate,
            allowEmptyData,
            minFocalLength,
            minFNumber,
            isExposureTimeInteger,
            resolution,
        } = this.criteriaForm.value as GallerySearchCriteria;
        let { minExposureTime } = this.criteriaForm.value as GallerySearchCriteria;

        if (!!name && !img.name.toLocaleLowerCase().includes(name?.toLocaleLowerCase())) {
            return false;
        }

        if (
            !!startDate &&
            !this.checkIfPassed(
                img.dateTimeOriginal,
                img.dateTimeOriginal ? img.dateTimeOriginal >= startDate : false,
                allowEmptyData,
            )
        ) {
            return false;
        }

        if (
            !!endDate &&
            !this.checkIfPassed(
                img.dateTimeOriginal,
                img.dateTimeOriginal ? img.dateTimeOriginal <= endDate : false,
                allowEmptyData,
            )
        ) {
            return false;
        }

        if (
            !!minFocalLength &&
            !this.checkIfPassed(
                img.focalLength,
                img.focalLength ? Number(img.focalLength) >= minFocalLength : false,
                allowEmptyData,
            )
        ) {
            return false;
        }

        if (
            !!minFNumber &&
            !this.checkIfPassed(img.fNumber, img.fNumber ? Number(img.fNumber) >= minFNumber : false, allowEmptyData)
        ) {
            return false;
        }

        if (
            !!resolution &&
            !this.checkIfPassed(img.resolution, img.resolution ? img.resolution > resolution : false, allowEmptyData)
        ) {
            return false;
        }

        if (!!minExposureTime) {
            if (!isExposureTimeInteger) {
                minExposureTime = 1 / minExposureTime;
            }

            if (
                !this.checkIfPassed(
                    img.exposureTime,
                    img.exposureTime ? Number(img.exposureTime) >= minExposureTime : false,
                    allowEmptyData,
                )
            ) {
                return false;
            }
        }
        return true;
    }

    checkIfPassed(property: ImageDataProp | null, check?: boolean, allowEmptyData?: boolean): boolean {
        if (!property) return !!allowEmptyData;
        return !!property && !!check;
    }

    navigateToSinglePictureView(imgData: ImageData): void {
        this.router.navigate(['/exif'], { state: { imgData: imgData } });
    }

    sortIconClick(): void {
        this.sortAsc = !this.sortAsc;
        this.search();
    }

    sortFieldChange(change?: MatSelectChange): void {
        if (!!change) {
            this.sortField = this.sortFields.find((it) => it.name === change.value);
        }
        this.search();
    }

    sortImages(images: ImageData[]): ImageData[] {
        return !!this.sortField?.field
            ? images.sort((a, b) => {
                  const fieldName = this.sortField?.field as keyof ImageData;
                  const firstProp = a[fieldName] as ImageDataProp;
                  const secProp = b[fieldName] as ImageDataProp;
                  if (!firstProp || !secProp) return this.sortAsc ? -1 : 1;
                  if (firstProp > secProp) return this.sortAsc ? 1 : -1;
                  if (firstProp === secProp) return 0;
                  else return this.sortAsc ? -1 : 1;
              })
            : images;
    }

    search(changeToFirstPage = false): void {
        let images = this.imageService.imagesData.value;
        images = this.filterImages(images);
        images = this.sortImages(images);
        this.imagesNumber = images.length;
        if (changeToFirstPage) {
            this.currentPage = 0;
        }
        this.getImagesPage(images);
    }

    clearRes(): void {
        this.criteriaForm.controls.resolution.setValue(null);
    }
}
