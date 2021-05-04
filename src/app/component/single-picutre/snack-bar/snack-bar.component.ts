import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface SnackBarData {
    message: string;
    snackBarType: SnackBarType;
}

export enum SnackBarType {
    ISSUE,
    OK,
}

@Component({
    selector: 'app-snack-bar',
    templateUrl: './snack-bar.component.html',
    styleUrls: ['./snack-bar.component.scss'],
})
export class SnackBarComponent {
    public snackBarData: SnackBarData;

    constructor(@Inject(MAT_SNACK_BAR_DATA) data: any) {
        this.snackBarData = data;
    }

    getIconName(): string {
        switch (this.snackBarData.snackBarType) {
            case SnackBarType.ISSUE:
                return 'error';
            case SnackBarType.OK:
                return 'done';
            default:
                return '';
        }
    }

    getMessage(): string {
        if (this.snackBarData.message) {
            return this.snackBarData.message;
        } else {
            switch (this.snackBarData.snackBarType) {
                case SnackBarType.ISSUE:
                    return 'error';
                case SnackBarType.OK:
                    return 'done';
                default:
                    return '';
            }
        }
    }
}
