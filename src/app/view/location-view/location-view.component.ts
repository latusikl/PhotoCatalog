import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageData } from 'src/app/model/ImageData';

@Component({
    selector: 'app-location-view',
    templateUrl: './location-view.component.html',
    styleUrls: ['./location-view.component.scss'],
})
export class LocationViewComponent implements OnInit {
    options: google.maps.MapOptions = {
        center: { lat: 52, lng: 19 },
        zoom: 3,
        maxZoom: 15,
        streetViewControl: false,
    };

    passedData!: ImageData;

    constructor(private location: Location) {}

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.passedData = this.location.getState().imgData;
    }
}
