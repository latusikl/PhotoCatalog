import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExifDisplayComponent } from './exif-display.component';
import { ElectronService } from 'ngx-electron';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('ExifDisplayComponent', () => {
    let component: ExifDisplayComponent;
    let fixture: ComponentFixture<ExifDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExifDisplayComponent],
            providers: [ElectronService],
            imports: [MatSnackBarModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExifDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
