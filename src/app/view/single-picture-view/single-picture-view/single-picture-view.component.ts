import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageData } from 'src/app/model/ImageData';

@Component({
    selector: 'app-single-picture-view',
    templateUrl: './single-picture-view.component.html',
    styleUrls: ['./single-picture-view.component.scss'],
})
export class SinglePictureViewComponent implements OnInit {
    shouldDisplayImgView = false;
    imgData: ImageData | undefined;

    constructor(private location: Location) {}

    ngOnInit(): void {
        // @ts-ignore
        const passedData: ImageData = this.location.getState().imgData;
        if (passedData) {
            this.imgData = passedData;
            this.shouldDisplayImgView = true;
        }
    }

    chooseSinglePicture() {
        //TODO Add Implementation in next steps of feature development
        console.error('NOT IMPLEMENTED');
    }

    getImgBase64(): string {
        return this.imgData ? this.imgData.base64 : '';
    }
}
