import { Injectable } from '@angular/core';
import {
    SnackBarComponent,
    SnackBarData,
    SnackBarType,
} from '../component/single-picutre/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackBarService {
    constructor(private snackBar: MatSnackBar) {}

    public displaySnackBar(snackBarData: SnackBarData, timeInSeconds: number) {
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: timeInSeconds * 1000,
            data: snackBarData,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: [this.getPanelClass(snackBarData.snackBarType)],
        });
    }

    private getPanelClass(snackBarType: SnackBarType): string {
        switch (snackBarType) {
            case SnackBarType.OK:
                return 'green-snackbar';
            case SnackBarType.ISSUE:
                return 'red-snackbar';
            default:
                return '';
        }
    }
}
