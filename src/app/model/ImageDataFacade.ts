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
                // setter: (value) => (this.imageData.dateTimeOriginal = new Date(value as string)),
                setter: (value) => console.log(value),
                formControl: new FormControl(ImageDataFacade.extractDateForInput(this.imageData.dateTimeOriginal), [
                    ImageDataFacade.validateDate,
                ]),
            },
            {
                inputType: 'number',
                propertyName: 'Focal length',
                unit: 'mm',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.focalLength, [Validators.required]),
            },
            {
                inputType: 'number',
                propertyName: 'F number',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.fNumber, []),
            },
            {
                inputType: 'number',
                propertyName: 'Exposure time',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.exposureTime, []),
            },
            {
                inputType: 'number',
                propertyName: 'X dimension pixels',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.pixelXDimension, []),
            },
            {
                inputType: 'number',
                propertyName: 'Y dimension pixels',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.pixelYDimension, []),
            },
            {
                inputType: 'number',
                propertyName: 'Iso speed rating',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.isoSpeedRatings, []),
            },
            {
                inputType: 'text',
                propertyName: 'Camera manufacturer',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.cameraMake, []),
            },
            {
                inputType: 'number',
                propertyName: 'Camera model',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.cameraModel, []),
            },
            {
                inputType: 'number',
                propertyName: 'Software',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.editingSoftware, []),
            },
            {
                inputType: 'text',
                propertyName: 'Image orientation',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.imageOrientation, []),
            },
            {
                inputType: 'text',
                propertyName: 'Latitude direction',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.gpsLatitudeRef, []),
            },
            {
                inputType: 'text',
                propertyName: 'Latitude',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.fNumber, []),
            },
            {
                inputType: 'text',
                propertyName: 'Longitude direction',
                setter: (value) => console.log(value),
                formControl: new FormControl(this.imageData.gpsLongitudeRef, []),
            },
            {
                inputType: 'text',
                propertyName: 'Longitude',
                setter: (value) => console.log(value),
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
