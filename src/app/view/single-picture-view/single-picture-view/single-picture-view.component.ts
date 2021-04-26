import { Component, HostBinding, NgZone, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageData } from 'src/app/model/ImageData';
import { ImageDataContract } from '../../../model/ImageDataContract';
import { ImageDataFacade } from '../../../model/ImageDataFacade';
import { DirectoryService } from '../../../service/directory.service';
import { SnackBarService } from '../../../service/snack-bar.service';
import { SnackBarType } from '../../../component/single-picutre/snack-bar/snack-bar.component';

@Component({
    selector: 'app-single-picture-view',
    templateUrl: './single-picture-view.component.html',
    styleUrls: ['./single-picture-view.component.scss'],
})
export class SinglePictureViewComponent implements OnInit {
    imageDataFacade?: ImageDataFacade;
    shouldDisplayImgView = false;

    @HostBinding('class')
    class = 'view';

    constructor(
        private location: Location,
        private directoryService: DirectoryService,
        private snackBarService: SnackBarService,
        private ngZone: NgZone,
    ) {}

    isImageDataContract(object: unknown): object is ImageDataContract {
        if (object) {
            const objectAsImageDataContract: ImageDataContract = object as ImageDataContract;
            return objectAsImageDataContract.name !== undefined && objectAsImageDataContract.path !== undefined;
        }
        return false;
    }

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const passedData: unknown = this.location.getState().imgData;

        if (this.isImageDataContract(passedData)) {
            this.imageDataFacade = new ImageDataFacade(
                new ImageData(passedData.name, passedData.path, passedData.exifData),
            );
            this.shouldDisplayImgView = true;
        }
    }

    chooseSinglePicture(): void {
        this.directoryService.callForSingleImageChoice();
        this.directoryService.chosenFile.subscribe({
            next: (value: ImageDataContract | null) => {
                this.ngZone.run(() => {
                    if (value) {
                        this.imageDataFacade = new ImageDataFacade(
                            new ImageData(value.name, value.path, value.exifData),
                        );
                        console.log(value);
                        this.shouldDisplayImgView = true;
                    } else {
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

    getImgPath(): string {
        return this.imageDataFacade ? this.imageDataFacade.imageData.path : '';
    }
}
