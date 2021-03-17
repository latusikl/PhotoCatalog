import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-location-view',
    templateUrl: './location-view.component.html',
    styleUrls: ['./location-view.component.scss'],
})
export class LocationViewComponent implements OnInit {
    options: google.maps.MapOptions = {
        center: { lat: 52, lng: 19 },
        zoom: 6,
    };

    constructor() {}

    ngOnInit(): void {}
}
