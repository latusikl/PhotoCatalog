import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarComponent, SnackBarData, SnackBarType } from './snack-bar.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

describe('SnackBarComponent', () => {
    let component: SnackBarComponent;
    let fixture: ComponentFixture<SnackBarComponent>;

    beforeEach(async () => {
        const sampleSnackBarData: SnackBarData = {
            message: 'Sample message',
            snackBarType: SnackBarType.ISSUE,
        };

        await TestBed.configureTestingModule({
            declarations: [SnackBarComponent],
            providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: sampleSnackBarData }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SnackBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
