import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePictureViewComponent } from './single-picture-view.component';
import { ElectronService } from 'ngx-electron';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

describe('SinglePictureViewComponent', () => {
    let component: SinglePictureViewComponent;
    let fixture: ComponentFixture<SinglePictureViewComponent>;
    let location: Location;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SinglePictureViewComponent],
            providers: [ElectronService],
            imports: [MatSnackBarModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SinglePictureViewComponent);
        location = TestBed.inject(Location);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
