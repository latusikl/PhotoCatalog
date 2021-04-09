import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImageDataFacade } from '../../../model/ImageDataFacade';
import { EditableImageDataProperty } from '../../../model/EditableImageDataProperty';
import { ImageService } from '../../../service/image.service';
import { Subscription } from 'rxjs';

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
            next: (data: [boolean, string]) => {
                console.log('Status: ' + data[0]);
                console.log(data[1]);
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
            this.imageDataFacade?.imageDataValues.forEach((value) => value.setter(value.formControl.value));
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
