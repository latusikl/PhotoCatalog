import { EditableImageDataProperty } from './EditableImageDataProperty';
import { ImageData } from './ImageData';
import { FormControl } from '@angular/forms';
import dayjs from 'dayjs';
import { ImageDataValidators } from './ImageDataValidators';

export class ImageDataFacade {
    imageDataValues: EditableImageDataProperty<string | number | Date | null>[];

    constructor(public imageData: ImageData) {
        this.imageDataValues = [
            {
                inputType: 'datetime-local',
                propertyName: 'Date and time',
                setter: (value) => (this.imageData.dateTimeOriginal = new Date(value as string)),
                formControl: new FormControl(ImageDataFacade.extractDateForInput(this.imageData.dateTimeOriginal), [
                    ImageDataValidators.date,
                ]),
            },
            {
                inputType: 'number',
                propertyName: 'Focal length',
                step: 0.01,
                unit: 'mm',
                setter: (value) => (this.imageData.focalLength = value as string),
                formControl: new FormControl(this.imageData.focalLength, [ImageDataValidators.nonNegative]),
            },
            {
                inputType: 'number',
                propertyName: 'F number',
                step: 0.01,
                setter: (value) => (this.imageData.focalLength = value as string),
                formControl: new FormControl(this.imageData.fNumber, [ImageDataValidators.nonNegative]),
            },
            {
                inputType: 'number',
                propertyName: 'Exposure time',
                step: 0.01,
                setter: (value) => (this.imageData.focalLength = value as string),
                formControl: new FormControl(this.imageData.exposureTime, [ImageDataValidators.nonNegative]),
            },
            {
                inputType: 'number',
                propertyName: 'X dimension',
                unit: 'px',
                step: 1,
                setter: (value) => (this.imageData.pixelXDimension = Number.parseInt(value as string)),
                formControl: new FormControl(this.imageData.pixelXDimension, [
                    ImageDataValidators.nonNegative,
                    ImageDataValidators.max(ImageDataValidators.LONG_MAX_VAL),
                ]),
            },
            {
                inputType: 'number',
                unit: 'px',
                propertyName: 'Y dimension',
                step: 1,
                setter: (value) => (this.imageData.pixelYDimension = Number.parseInt(value as string)),
                formControl: new FormControl(this.imageData.pixelYDimension, [
                    ImageDataValidators.nonNegative,
                    ImageDataValidators.max(ImageDataValidators.LONG_MAX_VAL),
                ]),
            },
            {
                inputType: 'number',
                propertyName: 'Iso speed rating',
                step: 1,
                setter: (value) => (this.imageData.isoSpeedRatings = Number.parseInt(value as string)),
                formControl: new FormControl(this.imageData.isoSpeedRatings, [
                    ImageDataValidators.nonNegative,
                    ImageDataValidators.max(ImageDataValidators.LONG_MAX_VAL),
                ]),
            },
            {
                inputType: 'text',
                setter: (value) => (this.imageData.cameraMake = value as string),
                propertyName: 'Camera manufacturer',
                formControl: new FormControl(this.imageData.cameraMake, [
                    ImageDataValidators.maxChars(ImageDataValidators.ASCII_MAX_CHARS),
                ]),
            },
            {
                inputType: 'text',
                propertyName: 'Camera model',
                setter: (value) => (this.imageData.cameraModel = value as string),
                formControl: new FormControl(this.imageData.cameraModel, [
                    ImageDataValidators.maxChars(ImageDataValidators.ASCII_MAX_CHARS),
                ]),
            },
            {
                inputType: 'text',
                propertyName: 'Software',
                setter: (value) => (this.imageData.editingSoftware = value as string),
                formControl: new FormControl(this.imageData.editingSoftware, [
                    ImageDataValidators.maxChars(ImageDataValidators.ASCII_MAX_CHARS),
                ]),
            },
            {
                inputType: 'number',
                step: 1,
                propertyName: 'Image orientation',
                setter: (value) => (this.imageData.imageOrientation = Math.floor(value as number)),
                formControl: new FormControl(this.imageData.imageOrientation, [
                    ImageDataValidators.min(1),
                    ImageDataValidators.max(8),
                ]),
            },
            {
                inputType: 'text',
                propertyName: 'Latitude direction',
                setter: (value) => console.debug(`GPS latitude ref setter not implemented ${value}`),
                formControl: new FormControl(this.imageData.gpsLatitudeRef, []),
            },
            {
                inputType: 'text',
                propertyName: 'Latitude',
                setter: (value) => console.debug(`Latitude  setter not implemented ${value}`),
                formControl: new FormControl(this.imageData.fNumber, []),
            },
            {
                inputType: 'text',
                propertyName: 'Longitude direction',
                setter: (value) => console.debug(`GPS Longitude Ref setter not implemented ${value}`),
                formControl: new FormControl(this.imageData.gpsLongitudeRef, []),
            },
            {
                inputType: 'text',
                propertyName: 'Longitude',
                setter: (value) => console.debug(`Longitude setter not implemented ${value}`),
                formControl: new FormControl(this.imageData.fNumber, []),
            },
        ];
    }

    private static extractDateForInput(date: Date | null): string {
        return date && !isNaN(date.getTime()) ? dayjs(date).format('YYYY-MM-DDThh:mm:ss') : '';
    }
}
