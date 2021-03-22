import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ImageService } from 'src/app/service/image.service';
import { IExifElement } from 'piexif-ts';
import { ImageData } from 'src/app/model/ImageData';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
})
export class MapComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;

    apiLoaded: Observable<boolean>;

    @Input()
    options: google.maps.MapOptions;

    markerOptions: google.maps.MarkerOptions = { draggable: false };
    markerPositions: google.maps.LatLngLiteral[] = [];

    constructor(httpClient: HttpClient, private imageService: ImageService) {
        this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js', 'callback').pipe(
            map(() => true),
            catchError(() => of(false)),
        );
        this.options = {};
    }

    ngOnInit(): void {
        this.imagesSub = this.imageService.imagesData.subscribe({
            next: (data) => {
                this.addMarkers(data);
            },
        });
    }

    ngOnDestroy(): void {
        this.imagesSub.unsubscribe();
    }

    addMarkers(imagesData: ImageData[]): void {
        imagesData.forEach((imageData) => {
            const gps = imageData.exifData?.GPS;
            if (!!gps) {
                this.markerPositions.push(this.calculateCoordinates(gps));
            }
        });
    }

    calculateCoordinates(gps: IExifElement): google.maps.LatLngLiteral {
        const latitudeTable = gps[2];
        let lat =
            latitudeTable[0][0] / latitudeTable[0][1] +
            latitudeTable[1][0] / (60 * latitudeTable[1][1]) +
            latitudeTable[2][0] / (3600 * latitudeTable[2][1]);

        const longitudeTable = gps[4];
        let lng =
            longitudeTable[0][0] / longitudeTable[0][1] +
            longitudeTable[1][0] / (60 * longitudeTable[1][1]) +
            longitudeTable[2][0] / (3600 * longitudeTable[2][1]);

        if (gps[1] === 'S') lat = -lat;
        if (gps[3] === 'W') lng = -lng;

        return { lat: lat, lng: lng };
    }
}
