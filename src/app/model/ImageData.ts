import { IExif, TagValues } from 'piexif-ts';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export class ImageData {
    constructor(public name: string, public path: string, public exifData?: IExif) {}

    get dateTimeOriginal(): Date | null {
        const exif = this.exifData?.Exif;
        if (!exif) {
            return null;
        }
        const str = String(exif[TagValues.ExifIFD.DateTimeOriginal]);
        return dayjs(str, 'YYYY:MM:DD HH:mm:ss').toDate();
    }

    set dateTimeOriginal(date: Date | null) {
        const exif = this.exifData?.Exif;
        if (!exif || !date) {
            return;
        }
        exif[TagValues.ExifIFD.DateTimeOriginal] = dayjs(date).format('YYYY:MM:DD HH:mm:ss');
    }

    get focalLength(): number | null {
        const exif = this.exifData?.Exif;
        if (!exif) {
            return null;
        }
        const spec = exif[TagValues.ExifIFD.FocalLength];
        return spec ? spec[0] / spec[1] : null;
    }

    get fNumber(): number | null {
        const exif = this.exifData?.Exif;
        if (!exif) {
            return null;
        }
        const spec = exif[TagValues.ExifIFD.FNumber];
        return spec ? spec[0] / spec[1] : null;
    }

    get exposureTime(): number | null {
        const exif = this.exifData?.Exif;
        if (!exif) {
            return null;
        }
        const spec = exif[TagValues.ExifIFD.ExposureTime];
        return spec ? spec[0] / spec[1] : null;
    }
}
