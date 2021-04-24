import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImageDataFacade } from '../../../model/ImageDataFacade';
import { EditableImageDataProperty } from '../../../model/EditableImageDataProperty';
import { ImageService } from '../../../service/image.service';
import { Subscription } from 'rxjs';
import { ExifModificationResult } from '../../../model/ExifModificationResult';

@Component({
    selector: 'app-exif-display',
    templateUrl: './exif-display.component.html',
    styleUrls: ['./exif-display.component.scss'],
})
export class ExifDisplayComponent implements OnInit, OnDestroy {
    constructor(private imageService: ImageService) {}

    @Input()
    imageDataFacade: ImageDataFacade | undefined;

    private modificationSubscription = Subscription.EMPTY;

    displayedColumns: string[] = ['name', 'value', 'unit'];
    isEditable = false;

    ngOnInit(): void {
        console.log(this.imageDataFacade);
        this.modificationSubscription = this.imageService.modificationResponse.subscribe({
            next: (data: ExifModificationResult | null) => {
                if (data) {
                    console.log('Status: ' + data.errorMessage);
                    console.log(data.modificationFailed);
                }
            },
        });
    }

    isExifData(): boolean {
        return !!this.imageDataFacade?.imageDataValues;
    }

    getDataSource(): EditableImageDataProperty<string | number | Date | null>[] {
        return !!this.imageDataFacade?.imageDataValues ? this.imageDataFacade?.imageDataValues : [];
    }

    editMode(): void {
        this.isEditable = !this.isEditable;
    }

    saveChanges(): void {
        console.debug('Save action executed');
        this.isEditable = false;
        if (this.imageDataFacade?.imageData) {
            this.imageDataFacade?.imageDataValues.forEach((value) => {
                if (value.formControl.dirty) {
                    value.setter(value.formControl.value);
                }
            });
            this.imageService.saveNewExifValue(this.imageDataFacade.imageData);
        }
    }

    areAllFormValuesValid(): boolean {
        return !this.imageDataFacade
            ? false
            : !!this.imageDataFacade.imageDataValues.find((imgDataValue) => imgDataValue.formControl.valid === false);
    }

    ngOnDestroy(): void {
        this.modificationSubscription.unsubscribe();
    }
}
