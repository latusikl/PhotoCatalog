import { IExif, TagValues } from 'piexif-ts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ImageDataContract } from './ImageDataContract';

dayjs.extend(customParseFormat);

export type ExifTag = keyof typeof TagValues.ExifIFD;
export type GpsTag = keyof typeof TagValues.GPSIFD;
export type ImageTag = keyof typeof TagValues.ImageIFD;

export class ImageData implements ImageDataContract {
    constructor(public name: string, public path: string, public exifData?: IExif) {}

    // eslint-disable-next-line
    private getExifAttribute(exifTag: ExifTag): any {
        const exifData = this.exifData?.Exif;
        return exifData ? exifData[TagValues.ExifIFD[exifTag]] : null;
    }

    // eslint-disable-next-line
    private getGpsAttribute(gpsTag: GpsTag): any {
        const gpsData = this.exifData?.GPS;
        return gpsData ? gpsData[TagValues.GPSIFD[gpsTag]] : null;
    }

    // eslint-disable-next-line
    private setGpsAttribute(gpsTag: GpsTag, value: any) {
        const gpsData = this.exifData?.GPS;
        if (gpsData) {
            gpsData[TagValues.GPSIFD[gpsTag]] = value;
        }
    }

    // eslint-disable-next-line
    private getImageAttribute0(imageTag: ImageTag): any {
        const imageData = this.exifData?.['0th'];
        return imageData ? imageData[TagValues.ImageIFD[imageTag]] : null;
    }

    // eslint-disable-next-line
    private setImageAttribute0(imageTag: ImageTag, value: any) {
        const imageData = this.exifData?.['0th'];
        if (imageData) {
            imageData[TagValues.ImageIFD[imageTag]] = value;
        }
    }

    // eslint-disable-next-line
    private getImageAttribute1(exifTag: ImageTag): any {
        const imageData = this.exifData?.['1st'];
        return imageData ? imageData[TagValues.ImageIFD[exifTag]] : null;
    }

    // eslint-disable-next-line
    private setImageAttribute1(imageTag: ImageTag, value: any) {
        const imageData = this.exifData?.['1st'];
        if (imageData) {
            imageData[TagValues.ImageIFD[imageTag]] = value;
        }
    }

    private setExifRealValue(value: number | null, exifTag: ExifTag) {
        console.error(value);
        value
            ? this.setExifAttribute(exifTag, [this.combineFractionalAndDecimalPart(value), 100])
            : this.setExifAttribute(exifTag, null);
    }

    private combineFractionalAndDecimalPart(value: number, precision = 2) {
        return value.toFixed(precision).replace('.', '');
    }

    // eslint-disable-next-line
    private setExifAttribute(exifTag: ExifTag, value: any): void {
        const exif = this.exifData?.Exif;
        if (exif) {
            exif[TagValues.ExifIFD[exifTag]] = value;
        }
    }

    get dateTimeOriginal(): Date | null {
        const str = String(this.getExifAttribute('DateTimeOriginal'));
        return dayjs(str, 'YYYY:MM:DD HH:mm:ss').toDate();
    }

    set dateTimeOriginal(date: Date | null) {
        if (date) {
            const value = dayjs(date).format('YYYY:MM:DD HH:mm:ss');
            this.setExifAttribute('DateTimeOriginal', value);
        }
    }

    get focalLength(): number | null {
        const spec = this.getExifAttribute('FocalLength');
        return spec ? spec[0] / spec[1] : null;
    }

    set focalLength(focalLength: number | null) {
        this.setExifRealValue(focalLength, 'FocalLength');
    }

    get fNumber(): number | null {
        const spec = this.getExifAttribute('FNumber');
        return spec ? spec[0] / spec[1] : null;
    }

    set fNumber(fNumber: number | null) {
        this.setExifRealValue(fNumber, 'FNumber');
    }

    get exposureTime(): number | null {
        const spec = this.getExifAttribute('ExposureTime');
        return spec ? spec[0] / spec[1] : null;
    }

    set exposureTime(exposureTime: number | null) {
        this.setExifRealValue(exposureTime, 'ExposureTime');
    }

    get pixelXDimension(): number | null {
        const value = this.getExifAttribute('PixelXDimension');
        return value ? value : null;
    }

    set pixelXDimension(pixelXDimension: number | null) {
        this.setExifAttribute('PixelYDimension', pixelXDimension);
    }

    get pixelYDimension(): number | null {
        const value = this.getExifAttribute('PixelYDimension');
        return value ? value : null;
    }

    set pixelYDimension(pixelYDimension: number | null) {
        this.setExifAttribute('PixelYDimension', pixelYDimension);
    }

    get isoSpeedRatings(): number | null {
        const value = this.getExifAttribute('ISOSpeedRatings');
        return value ? value : null;
    }

    set isoSpeedRatings(isoSpeedRatings: number | null) {
        this.setExifAttribute('ISOSpeedRatings', isoSpeedRatings);
    }

    get cameraMake(): string | null {
        const value = this.getImageAttribute0('Make');
        return value ? String(value) : null;
    }

    set cameraMake(cameraMake: string | null) {
        this.setImageAttribute0('Make', cameraMake);
    }

    get cameraModel(): string | null {
        const value = this.getImageAttribute0('Model');
        return value ? String(value) : null;
    }

    set cameraModel(cameraModel: string | null) {
        this.setImageAttribute0('Model', cameraModel);
    }

    get editingSoftware(): string | null {
        const value = this.getImageAttribute0('Software');
        return value ? String(value) : null;
    }

    set editingSoftware(editingSoftware: string | null) {
        this.setImageAttribute0('Software', editingSoftware);
    }

    //TODO Resolve how to set and display ImageOrientation and Gps data.
    get imageOrientation(): number | null {
        const value = this.getImageAttribute1('Orientation');
        return value ? value : null;
    }

    get gpsLatitudeRef(): string | null {
        const value = this.getGpsAttribute('GPSLatitudeRef');
        return value ? String(value) : null;
    }

    get gpsLatitude(): string | null {
        const value = this.getGpsAttribute('GPSLatitude');
        return value ? String(value) : null;
    }

    get gpsLongitudeRef(): string | null {
        const value = this.getGpsAttribute('GPSLongitudeRef');
        return value ? String(value) : null;
    }

    get gpsLongitude(): string | null {
        const value = this.getGpsAttribute('GPSLongitude');
        return value ? String(value) : null;
    }

    get resolution(): number | null {
        const xRes = this.getExifAttribute('PixelXDimension') as number;
        const yRes = this.getExifAttribute('PixelYDimension') as number;
        return !!xRes && !!yRes ? xRes * yRes : null;
    }
}
