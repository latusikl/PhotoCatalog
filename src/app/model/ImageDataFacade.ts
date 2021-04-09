import { EditableImageDataProperty } from './EditableImageDataProperty';
import { ImageData } from './ImageData';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import dayjs from 'dayjs';

export class ImageDataFacade {
    imageDataValues: EditableImageDataProperty<string | number | Date | null>[];

    constructor(public imageData: ImageData) {
        this.imageDataValues = [
            {
                inputType: 'datetime-local',
                propertyName: 'Date and time',
                setter: (value) => (this.imageData.dateTimeOriginal = new Date(value as string)),
                formControl: new FormControl(ImageDataFacade.extractDateForInput(this.imageData.dateTimeOriginal), [
                    ImageDataFacade.validateDate,
                ]),
            },
            {
                inputType: 'number',
                propertyName: 'Focal length',
                step: 0.01,
                unit: 'mm',
                setter: (value) => (this.imageData.focalLength = Number.parseFloat(value as string)),
                formControl: new FormControl(this.imageData.focalLength, [Validators.required]),
            },
            {
                inputType: 'number',
                propertyName: 'F number',
                step: 0.01,
                setter: (value) => (this.imageData.fNumber = Number.parseFloat(value as string)),
                formControl: new FormControl(this.imageData.fNumber, []),
            },
            {
                inputType: 'number',
                propertyName: 'Exposure time',
                step: 0.01,
                setter: (value) => (this.imageData.exposureTime = Number.parseFloat(value as string)),
                formControl: new FormControl(this.imageData.exposureTime, []),
            },
            {
                inputType: 'number',
                propertyName: 'X dimension pixels',
                step: 1,
                setter: (value) => (this.imageData.pixelXDimension = Number.parseInt(value as string)),
                formControl: new FormControl(this.imageData.pixelXDimension, []),
            },
            {
                inputType: 'number',
                propertyName: 'Y dimension pixels',
                step: 1,
                setter: (value) => (this.imageData.pixelYDimension = Number.parseInt(value as string)),
                formControl: new FormControl(this.imageData.pixelYDimension, []),
            },
            {
                inputType: 'number',
                propertyName: 'Iso speed rating',
                step: 1,
                setter: (value) => (this.imageData.isoSpeedRatings = Number.parseInt(value as string)),
                formControl: new FormControl(this.imageData.isoSpeedRatings, []),
            },
            {
                inputType: 'text',
                setter: (value) => (this.imageData.cameraMake = value as string),
                propertyName: 'Camera manufacturer',
                formControl: new FormControl(this.imageData.cameraMake, []),
            },
            {
                inputType: 'text',
                propertyName: 'Camera model',
                setter: (value) => (this.imageData.cameraModel = value as string),
                formControl: new FormControl(this.imageData.cameraModel, []),
            },
            {
                inputType: 'text',
                propertyName: 'Software',
                setter: (value) => (this.imageData.editingSoftware = value as string),
                formControl: new FormControl(this.imageData.editingSoftware, []),
            },
            {
                inputType: 'text',
                propertyName: 'Image orientation',
                setter: (value) => console.debug(`Image orientation setter not implemented ${value}`),
                formControl: new FormControl(this.imageData.imageOrientation, []),
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
        return date ? date.toISOString().slice(0, 16) : '';
    }

    private static validateDate(): ValidatorFn {
        return (control) => {
            if (dayjs(control.value).isValid()) {
                return null;
            } else {
                return { message: 'Date value is invalid' };
            }
        };
    }
}
