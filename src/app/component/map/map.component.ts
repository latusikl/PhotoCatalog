import { Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ImageService } from 'src/app/service/image.service';
import { IExifElement } from 'piexif-ts';
import { ImageData } from 'src/app/model/ImageData';
import { MapService } from 'src/app/service/map.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MarkerData } from 'src/app/model/MarkerData';
import { mergeMap } from 'rxjs/operators';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
    private imagesSub = Subscription.EMPTY;
    private mapSub = Subscription.EMPTY;

    apiLoaded = false;

    @Input()
    options: google.maps.MapOptions = {};

    @Input()
    imageData!: ImageData;

    markerOptions: google.maps.MarkerOptions = { draggable: false, animation: 2 };
    markersData: MarkerData[] = [];

    imagePath = '';

    @ViewChild(MapInfoWindow)
    infoWindow!: MapInfoWindow;

    @ViewChild(GoogleMap)
    map!: GoogleMap;

    editMode = false;

    constructor(private imageService: ImageService, private mapService: MapService, private ngZone: NgZone) {}

    ngOnInit(): void {
        this.mapService.apiLoaded
            .pipe(
                mergeMap((value) => {
                    this.apiLoaded = value;
                    if (value) return this.imageData ? of([this.imageData]) : this.imageService.imagesData;
                    return of([]);
                }),
            )
            .subscribe({
                next: (data) =>
                    this.ngZone.run(() => {
                        setTimeout(() => this.addMarkers(data));
                    }),
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

    editExif(marker: MapMarker): void {
        this.editMode = true;
        const position = marker.getPosition();

        if (!this.imageData?.exifData?.GPS || !position?.toJSON()) return;
        this.calculateExifGPSLatitude(this.imageData.exifData.GPS, position.toJSON());
        this.calculateExifGPSLongitude(this.imageData.exifData.GPS, position.toJSON());
    }

    toDegreesMinutesAndSeconds(coordinate: number): [number, number, number] {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = (minutesNotTruncated - minutes) * 60;

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
        if (!!imagesData.length) {
            const bounds = new google.maps.LatLngBounds();

            this.markersData = [];
            if (this.imageData) {
                this.markerOptions = { draggable: true, animation: 1 };
            }

            imagesData.forEach((imageData) => {
                const gps = imageData.exifData?.GPS;
                if (!!gps) {
                    const coordinates = this.calculateCoordinates(gps);
                    this.markersData.push({ position: coordinates, imagePath: imageData.path });
                    bounds.extend(coordinates);
                }
            });
            this.map.fitBounds(bounds);
        }
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

    saveData(): void {
        this.imageService.saveNewExifValue(this.imageData);
    }
}
