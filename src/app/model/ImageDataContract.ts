import { IExif } from 'piexif-ts';

export interface ImageDataContract {
    name: string;
    path: string;
    exifData?: IExif;
}
