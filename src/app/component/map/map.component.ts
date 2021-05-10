import { Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ImageService } from 'src/app/service/image.service';
import { IExifElement } from 'piexif-ts';
import { ImageData } from 'src/app/model/ImageData';
import { MapService } from 'src/app/service/map.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MarkerData } from 'src/app/model/MarkerData';
import { mergeMap } from 'rxjs/operators';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { SnackBarType } from '../single-picutre/snack-bar/snack-bar.component';
import { CoordinatesService } from '../../service/coordinates.service';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
    readonly AEI_LAT_LNG = { lat: 50.2891, lng: 18.6778 };

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

    constructor(
        private imageService: ImageService,
        private mapService: MapService,
        private ngZone: NgZone,
        private snackBarService: SnackBarService,
        private coordinatesService: CoordinatesService,
    ) {}

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
        this.coordinatesService.calculateExifGPSLatitude(this.imageData.exifData.GPS, position.toJSON());
        this.coordinatesService.calculateExifGPSLongitude(this.imageData.exifData.GPS, position.toJSON());
    }

    addMarkers(imagesData: ImageData[]): void {
        if (!!imagesData.length) {
            const bounds = new google.maps.LatLngBounds();

            this.markersData = [];
            if (this.imageData) {
                this.markerOptions = { draggable: true, animation: 1 };
            }

            if (!imagesData.some((imageData) => !!imageData.exifData?.GPS)) {
                const coordinates = this.AEI_LAT_LNG;
                bounds.extend(coordinates);
            } else {
                imagesData.forEach((imageData) => {
                    const gps = imageData.exifData?.GPS;
                    if (!!gps) {
                        const coordinates = this.calculateCoordinates(gps);
                        this.markersData.push({ position: coordinates, imagePath: imageData.path });
                        bounds.extend(coordinates);
                    }
                });
            }

            this.map.fitBounds(bounds);
        }
    }

    calculateCoordinates(gps: IExifElement): google.maps.LatLngLiteral {
        return this.coordinatesService.calculateCoordinates(gps);
    }

    saveData(): void {
        this.imageService.saveNewExifValue(this.imageData);
        this.snackBarService.displaySnackBar(
            {
                snackBarType: SnackBarType.OK,
                message: 'Modification has been saved!',
            },
            3,
        );
        this.editMode = false;
    }
}
