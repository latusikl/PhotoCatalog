import { IExif } from 'piexif-ts';

export interface ImageData {
    name: string;
    path: string;
    exifData?: IExif;
}
