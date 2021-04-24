import { ValidatorFn } from '@angular/forms';
import dayjs from 'dayjs';

export class ImageDataValidators {
    public static validateDate(): ValidatorFn {
        return (control) => {
            if (dayjs(control.value).isValid()) {
                return null;
            } else {
                return { message: 'Date value is invalid' };
            }
        };
    }

    public static validateMin(min: number): ValidatorFn {
        return (control) => {
            const val = control.value;
            if (val && Number(val) < min) {
                return { message: `Value is too small. Minimal value: ${min}` };
            } else {
                return null;
            }
        };
    }

    public static validateMax(max: number): ValidatorFn {
        return (control) => {
            const val = control.value;
            if (val && Number(val) > max) {
                return { message: `Value is too big. Maximal value: ${max}` };
            } else {
                return null;
            }
        };
    }
}
