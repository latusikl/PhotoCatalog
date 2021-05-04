import { ValidatorFn, Validators } from '@angular/forms';
import dayjs from 'dayjs';

export class ImageDataValidators {
    static readonly LONG_MAX_VAL = 2_147_483_647;
    static readonly SHORT_MAX_VAL = 65_536;
    static readonly ASCII_MAX_CHARS = 128;
    static readonly ZERO = 0;

    static date(): ValidatorFn {
        return (control) => {
            if (dayjs(control.value).isValid()) {
                return null;
            } else {
                return { message: 'Date value is invalid' };
            }
        };
    }

    static min(min: number): ValidatorFn {
        return (control) => {
            return Validators.min(min)(control) ? { message: `Value is too small. Minimal value: ${min}` } : null;
        };
    }

    static max(max: number): ValidatorFn {
        return (control) => {
            return Validators.max(max)(control) ? { message: `Value is too big. Maximal value: ${max}` } : null;
        };
    }

    static nonNegative(): ValidatorFn {
        return ImageDataValidators.min(ImageDataValidators.ZERO);
    }

    static maxChars(max: number): ValidatorFn {
        return (control) => {
            return Validators.maxLength(max)(control)
                ? { message: `String is too long. Maximum amount of characters: ${max}` }
                : null;
        };
    }
}
