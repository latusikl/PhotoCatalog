import { Component, HostBinding, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageData } from 'src/app/model/ImageData';
import { ImageDataContract } from '../../../model/ImageDataContract';
import { ImageDataFacade } from '../../../model/ImageDataFacade';

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

    constructor(private location: Location) {}

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
        //TODO Add Implementation in next steps of feature development
        console.error('NOT IMPLEMENTED');
    }

    getImgPath(): string {
        return this.imageDataFacade ? this.imageDataFacade.imageData.path : '';
    }
}
