import { IExif, TagValues } from 'piexif-ts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

type ExifTag = keyof typeof TagValues.ExifIFD;

export class ImageData {
    constructor(public name: string, public path: string, public exifData?: IExif) {}

    // eslint-disable-next-line
    private getExifAttribute(exifTag: ExifTag): any {
        const exif = this.exifData?.Exif;
        return exif ? exif[TagValues.ExifIFD[exifTag]] : null;
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
}
