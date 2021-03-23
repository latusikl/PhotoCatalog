import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExifDisplayComponent } from './exif-display.component';

describe('ExifDisplayComponent', () => {
    let component: ExifDisplayComponent;
    let fixture: ComponentFixture<ExifDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExifDisplayComponent],
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
