import { ExifTag, GpsTag, ImageTag } from './ImageData';

export interface EditableImageDataProperty<T> {
    propertyType: ExifTag | GpsTag | ImageTag;
    propertyName: string;
    unit?: string;
    property: T;
    validator: (value: T) => boolean;
    setter: (value: T) => void;
}
