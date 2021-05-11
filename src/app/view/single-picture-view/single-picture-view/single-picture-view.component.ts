import { Component, HostBinding, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageData } from 'src/app/model/ImageData';
import { ImageDataContract } from '../../../model/ImageDataContract';
import { ImageDataFacade } from '../../../model/ImageDataFacade';
import { DirectoryService } from '../../../service/directory.service';
import { SnackBarService } from '../../../service/snack-bar.service';
import { SnackBarType } from '../../../component/single-picutre/snack-bar/snack-bar.component';
import { Subscription } from 'rxjs';
import { CoordinatesService } from '../../../service/coordinates.service';

@Component({
    selector: 'app-single-picture-view',
    templateUrl: './single-picture-view.component.html',
    styleUrls: ['./single-picture-view.component.scss'],
})
export class SinglePictureViewComponent implements OnInit, OnDestroy {
    imageDataFacade?: ImageDataFacade;
    shouldDisplayImgView = false;
    private singlePictureChoiceSubscription = Subscription.EMPTY;

    @HostBinding('class')
    class = 'view';

    constructor(
        private location: Location,
        private directoryService: DirectoryService,
        private snackBarService: SnackBarService,
        private ngZone: NgZone,
        private coordinatesService: CoordinatesService,
    ) {}

    isImageDataContract(object: unknown): object is ImageDataContract {
        if (object) {
            const objectAsImageDataContract: ImageDataContract = object as ImageDataContract;
            return objectAsImageDataContract.name !== undefined && objectAsImageDataContract.path !== undefined;
        }
        return false;
    }

    ngOnInit(): void {
        this.singlePictureChoiceSubscription = this.setupSinglePictureSubscription();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const passedData: unknown = this.location.getState().imgData;

        if (this.isImageDataContract(passedData)) {
            this.directoryService.chosenFile.next(passedData);
            this.shouldDisplayImgView = true;
        } else {
            this.imageDataFacade = undefined;
        }
    }

    private setupSinglePictureSubscription(): Subscription {
        return this.directoryService.chosenFile.subscribe({
            next: (value: ImageDataContract | null | undefined) => {
                this.ngZone.run(() => {
                    if (value) {
                        this.imageDataFacade = new ImageDataFacade(
                            new ImageData(value.name, value.path, value.exifData),
                            this.coordinatesService,
                        );
                        this.shouldDisplayImgView = true;
                    } else if (value === null) {
                        this.snackBarService.displaySnackBar(
                            {
                                message: 'Unable to read/open chosen file',
                                snackBarType: SnackBarType.ISSUE,
                            },
                            2,
                        );
                    }
                });
            },
        });
    }

    chooseSinglePicture(): void {
        this.directoryService.callForSingleImageChoice();
    }

    getImgPath(): string {
        return this.imageDataFacade ? this.imageDataFacade.imageData.path : '';
    }

    ngOnDestroy(): void {
        this.singlePictureChoiceSubscription.unsubscribe();
    }
}
