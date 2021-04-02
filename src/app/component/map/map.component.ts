import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/service/image.service';
import { IExifElement } from 'piexif-ts';
import { ImageData } from 'src/app/model/ImageData';
import { MapService } from 'src/app/service/map.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MarkerData } from 'src/app/model/MarkerData';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
})
export class MapComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;
    private mapSub = Subscription.EMPTY;

    apiLoaded = false;

    @Input()
    options: google.maps.MapOptions = {};

    markerOptions: google.maps.MarkerOptions = { draggable: true };
    markersData: MarkerData[] = [];

    imagePath = '';

    @ViewChild(MapInfoWindow)
    infoWindow!: MapInfoWindow;

    constructor(private imageService: ImageService, private mapService: MapService) {}

    ngOnInit(): void {
        this.imagesSub = this.imageService.imagesData.subscribe({
            next: (data) => {
                this.addMarkers(data);
            },
        });
        this.mapSub = this.mapService.apiLoaded.subscribe({
            next: (data) => {
                this.apiLoaded = data;
            },
        });
    }

    ngOnDestroy(): void {
        this.imagesSub.unsubscribe();
        this.mapSub.unsubscribe();
    }

    openInfoWindow(marker: MapMarker, imagePath: string): void {
        this.infoWindow.open(marker);
        this.imagePath = imagePath;
    }

    editExif(marker: MapMarker, markerData: MarkerData): void {
        const image = this.imageService.imagesData.value.find((image) => {
            return image.path === markerData.imagePath;
        });
        const pozision = marker.getPosition();

        if (!image?.exifData?.GPS || !pozision?.toJSON()) return;
        this.calculateExifGPSLatitude(image.exifData.GPS, pozision.toJSON());
        this.calculateExifGPSLongitude(image.exifData.GPS, pozision.toJSON());
    }

    toDegreesMinutesAndSeconds(coordinate: number): [number, number, number] {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

        return [degrees, minutes, seconds];
    }

    calculateExifGPSLatitude(gps: IExifElement, coordinates: google.maps.LatLngLiteral): void {
        const latitudeTable = gps[2];

        const [degrees, minutes, seconds] = this.toDegreesMinutesAndSeconds(coordinates.lat);

        latitudeTable[0][0] = degrees;
        latitudeTable[1][0] = minutes;
        latitudeTable[2][0] = seconds;
        latitudeTable[0][1] = latitudeTable[1][1] = latitudeTable[2][1] = 1;
        gps[1] = coordinates.lat >= 0 ? 'N' : 'S';
    }

    calculateExifGPSLongitude(gps: IExifElement, coordinates: google.maps.LatLngLiteral): void {
        const latitudeTable = gps[4];

        const [degrees, minutes, seconds] = this.toDegreesMinutesAndSeconds(coordinates.lng);

        latitudeTable[0][0] = degrees;
        latitudeTable[1][0] = minutes;
        latitudeTable[2][0] = seconds;
        latitudeTable[0][1] = latitudeTable[1][1] = latitudeTable[2][1] = 1;
        gps[3] = coordinates.lng >= 0 ? 'E' : 'W';
    }

    addMarkers(imagesData: ImageData[]): void {
        imagesData.forEach((imageData) => {
            const gps = imageData.exifData?.GPS;
            if (!!gps) {
                this.markersData.push({ position: this.calculateCoordinates(gps), imagePath: imageData.path });
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
