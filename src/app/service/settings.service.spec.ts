import { TestBed } from '@angular/core/testing';
import { ElectronService } from 'ngx-electron';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
    let service: SettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SettingsService, ElectronService],
        });
        service = TestBed.inject(SettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
