import { EditableImageDataProperty } from './EditableImageDataProperty';
import { ImageData } from './ImageData';

export class ImageDataFacade {
    imageDataValues: EditableImageDataProperty<string | number | Date | null>[];

    constructor(public imageData: ImageData) {
        this.imageDataValues = [
            {
                propertyType: 'DateTimeOriginal',
                propertyName: 'Date and time',
                property: this.imageData.dateTimeOriginal,
                setter: (value) => (this.imageData.dateTimeOriginal = value as Date | null),
                validator: (value) => value instanceof Date,
            },
            {
                propertyType: 'FocalLength',
                propertyName: 'Focal length',
                unit: 'mm',
                property: this.imageData.focalLength,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'string',
            },
            {
                propertyType: 'FNumber',
                propertyName: 'F number',
                property: this.imageData.fNumber,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'number',
            },
            {
                propertyType: 'ExposureTime',
                propertyName: 'Exposure time',
                property: this.imageData.exposureTime,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'number',
            },
            {
                propertyType: 'PixelXDimension',
                propertyName: 'X dimension pixels',
                property: this.imageData.pixelXDimension,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'number',
            },
            {
                propertyType: 'PixelYDimension',
                propertyName: 'Y dimension pixels',
                property: this.imageData.pixelYDimension,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'number',
            },
            {
                propertyType: 'ISOSpeedRatings',
                propertyName: 'Iso speed rating',
                property: this.imageData.isoSpeedRatings,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'number',
            },
            {
                propertyType: 'Make',
                propertyName: 'Camera manufacturer',
                property: this.imageData.cameraMake,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'string',
            },
            {
                propertyType: 'Model',
                propertyName: 'Camera model',
                property: this.imageData.cameraModel,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'string',
            },
            {
                propertyType: 'Software',
                propertyName: 'Software',
                property: this.imageData.editingSoftware,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'string',
            },
            {
                propertyType: 'Orientation',
                propertyName: 'Image orientation',
                property: this.imageData.imageOrientation,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'number',
            },
            {
                propertyType: 'GPSLatitudeRef',
                propertyName: 'Latitude direction',
                property: this.imageData.gpsLatitudeRef,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'string',
            },
            {
                propertyType: 'GPSLatitude',
                propertyName: 'Latitude',
                property: this.imageData.fNumber,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'string',
            },
            {
                propertyType: 'GPSLongitudeRef',
                propertyName: 'Longitude direction',
                property: this.imageData.gpsLongitudeRef,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'string',
            },
            {
                propertyType: 'GPSLongitude',
                propertyName: 'Longitude',
                property: this.imageData.fNumber,
                setter: (value) => console.log(value),
                validator: (value) => typeof value === 'number',
            },
        ];
    }
}
