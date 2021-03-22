import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-single-picture-view',
    templateUrl: './single-picture-view.component.html',
    styleUrls: ['./single-picture-view.component.scss'],
})
export class SinglePictureViewComponent implements OnInit {
    constructor(private location: Location) {}

    shouldDisplayImgView = false;

    ngOnInit(): void {
        const obj = this.location.getState();
        if (obj) {
            this.shouldDisplayImgView = true;
        }
    }

    chooseSinglePicture() {
        //TODO Add Implementation in next steps of feature development
        console.error('NOT IMPLEMENTED');
    }
}
