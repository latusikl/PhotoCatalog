import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ImageDataFacade } from '../../../model/ImageDataFacade';
import { EditableImageDataProperty } from '../../../model/EditableImageDataProperty';
import { ImageService } from '../../../service/image.service';
import { Subscription } from 'rxjs';
import { ExifModificationResult } from '../../../model/ExifModificationResult';
import { SnackBarService } from '../../../service/snack-bar.service';
import { SnackBarData, SnackBarType } from '../snack-bar/snack-bar.component';

@Component({
    selector: 'app-exif-display',
    templateUrl: './exif-display.component.html',
    styleUrls: ['./exif-display.component.scss'],
})
export class ExifDisplayComponent implements OnInit, OnDestroy {
    constructor(private imageService: ImageService, private ngZone: NgZone, private snackBarService: SnackBarService) {}

    tableData: EditableImageDataProperty<string | number | Date | null>[] = [];
    private _imageDataFacade?: ImageDataFacade;
    private modificationSubscription = Subscription.EMPTY;

    @Input() set imageDataFacade(imageDataFacade: ImageDataFacade | undefined) {
        this._imageDataFacade = imageDataFacade;
        if (imageDataFacade) {
            this.tableData = imageDataFacade.imageDataValues;
        }
    }

    get imageDataFacade(): ImageDataFacade | undefined {
        return this._imageDataFacade;
    }

    displayedColumns: string[] = ['name', 'value', 'unit'];
    isEditable = false;

    ngOnInit(): void {
        this.modificationSubscription = this.imageService.modificationResponse.subscribe({
            next: (data: ExifModificationResult | null) => {
                if (data) {
                    this.ngZone.run(() => {
                        this.snackBarService.displaySnackBar(this.mapModyficationResultsToSnackBar(data), 3);
                    });
                }
            },
        });
    }

    private mapModyficationResultsToSnackBar(data: ExifModificationResult): SnackBarData {
        return data.modificationFailed
            ? {
                  snackBarType: SnackBarType.ISSUE,
                  message: data.errorMessage,
              }
            : {
                  snackBarType: SnackBarType.OK,
                  message: 'Modification has been saved!',
              };
    }

    isExifData(): boolean {
        return !!this.imageDataFacade?.imageDataValues;
    }

    editMode(): void {
        this.isEditable = !this.isEditable;
    }

    saveChanges(): void {
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
