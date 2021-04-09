import { FormControl } from '@angular/forms';

export type InputType =
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';

export interface EditableImageDataProperty<T> {
    inputType: InputType;
    propertyName: string;
    step?: number;
    unit?: string;
    setter: (value: T) => void;
    formControl: FormControl;
}
