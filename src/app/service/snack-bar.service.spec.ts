import { TestBed } from '@angular/core/testing';

import { SnackBarService } from './snack-bar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    SnackBarComponent,
    SnackBarData,
    SnackBarType,
} from '../component/single-picutre/snack-bar/snack-bar.component';

describe('SnackBarService', () => {
    let service: SnackBarService;
    let matSnackBar: any;

    beforeEach(() => {
        const matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

        TestBed.configureTestingModule({
            providers: [SnackBarService, { provide: MatSnackBar, useValue: matSnackBarSpy }],
        });

        service = TestBed.inject(SnackBarService);
        matSnackBar = TestBed.inject(MatSnackBar);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call for MatSnackBar with proper data', () => {
        //given
        const snackBarData: SnackBarData = {
            message: 'Sample message',
            snackBarType: SnackBarType.OK,
        };
        //when
        service.displaySnackBar(snackBarData, 2);
        //then
        expect(matSnackBar.openFromComponent).toHaveBeenCalledOnceWith(SnackBarComponent, {
            duration: 2000,
            data: snackBarData,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['green-snackbar'],
        });
    });
});
