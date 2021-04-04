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

    private getGpsAttribute(exifTag: GpsTag): any {
        const gpsData = this.exifData?.GPS;
        return gpsData ? gpsData[TagValues.GPSIFD[exifTag]] : null;
    }

    private getImageAttribute0(exifTag: ImageTag): any {
        const imageData = this.exifData?.['0th'];
        return imageData ? imageData[TagValues.ImageIFD[exifTag]] : null;
    }

    private getImageAttribute1(exifTag: ImageTag): any {
        const imageData = this.exifData?.['1st'];
        return imageData ? imageData[TagValues.ImageIFD[exifTag]] : null;
    }

    // eslint-disable-next-line
    private setExifAttribute(exifTag: ExifTag, value: any) {
        const exif = this.exifData?.Exif;
        if (!exif || !value) {
            return;
        }
        exif[TagValues.ExifIFD[exifTag]] = value;
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

    get fNumber(): number | null {
        const spec = this.getExifAttribute('FNumber');
        return spec ? spec[0] / spec[1] : null;
    }

    get exposureTime(): number | null {
        const spec = this.getExifAttribute('ExposureTime');
        return spec ? spec[0] / spec[1] : null;
    }

    get pixelXDimension(): number | null {
        const value = this.getExifAttribute('PixelXDimension');
        return value ? value : null;
    }

    get pixelYDimension(): number | null {
        const value = this.getExifAttribute('PixelYDimension');
        return value ? value : null;
    }

    get isoSpeedRatings(): number | null {
        const value = this.getExifAttribute('ISOSpeedRatings');
        return value ? value : null;
    }

    get cameraMake(): string | null {
        const value = this.getImageAttribute0('Make');
        return value ? String(value) : null;
    }

    get cameraModel(): string | null {
        const value = this.getImageAttribute0('Model');
        return value ? String(value) : null;
    }

    get editingSoftware(): string | null {
        const value = this.getImageAttribute0('Software');
        return value ? String(value) : null;
    }

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
}
