import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ElectronService } from 'ngx-electron';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
    let component: MapComponent;
    let fixture: ComponentFixture<MapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [ElectronService],
            declarations: [MapComponent],
            imports: [HttpClientTestingModule, MatSnackBarModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
