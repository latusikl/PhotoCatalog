import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ImageDataFacade } from '../../../model/ImageDataFacade';
import { EditableImageDataProperty, InputType } from '../../../model/EditableImageDataProperty';
import { ImageService } from '../../../service/image.service';
import { Subscription } from 'rxjs';
import { ExifModificationResult } from '../../../model/ExifModificationResult';
import { SnackBarService } from '../../../service/snack-bar.service';
import { SnackBarData, SnackBarType } from '../snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-exif-display',
    templateUrl: './exif-display.component.html',
    styleUrls: ['./exif-display.component.scss'],
})
export class ExifDisplayComponent implements OnInit, OnDestroy {
    constructor(
        private imageService: ImageService,
        private ngZone: NgZone,
        private snackBarService: SnackBarService,
        private router: Router,
    ) {}

    tableData: EditableImageDataProperty<string | number | Date | null>[] = [];
    displayedColumns: string[] = ['name', 'value', 'unit'];
    isEditable = false;
    private _imageDataFacade?: ImageDataFacade;
    private modificationSubscription = Subscription.EMPTY;

    @Input() set imageDataFacade(imageDataFacade: ImageDataFacade | undefined) {
        this._imageDataFacade = imageDataFacade;
        if (imageDataFacade) {
            console.log(imageDataFacade);
            this.tableData = imageDataFacade.imageDataValues;
            this.setFormControlsToNonEditable();
        }
    }

    get imageDataFacade(): ImageDataFacade | undefined {
        return this._imageDataFacade;
    }

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

    private setFormControlsToNonEditable(): void {
        this.tableData.forEach((value) => value.formControl.disable());
    }

    private setFormControlsToEditable(): void {
        this.tableData.forEach((value) => value.formControl.enable());
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

    switchEditMode(): void {
        this.isEditable = !this.isEditable;
        this.isEditable ? this.setFormControlsToEditable() : this.setFormControlsToNonEditable();
    }

    passToLocationView(): void {
        this.router.navigate(['/location'], { state: { imgData: this._imageDataFacade?.imageData } });
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
        return !!this.imageDataFacade?.imageDataValues.find((imgDataValue) => imgDataValue.formControl.valid === false);
    }

    ngOnDestroy(): void {
        this.modificationSubscription.unsubscribe();
    }

    isDateTimeField(inputType: InputType) {
        return inputType === 'datetime-local' || inputType === 'datetime';
    }
}
