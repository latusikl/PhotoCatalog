import { IExif } from 'piexif-ts';

export interface ImageData {
    base64: string;
    exifData?: IExif;
}
