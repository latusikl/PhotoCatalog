import { Injectable } from '@angular/core';
import { IExifElement } from 'piexif-ts';

@Injectable({
    providedIn: 'root',
})
export class CoordinatesService {
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

    private toDegreesMinutesAndSeconds(coordinate: number): [number, number, number] {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = (minutesNotTruncated - minutes) * 60;

        return [degrees, minutes, seconds];
    }
}
