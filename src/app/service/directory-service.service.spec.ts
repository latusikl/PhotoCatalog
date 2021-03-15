import { TestBed } from '@angular/core/testing';
import { ElectronService } from 'ngx-electron';

import { DirectoryService } from './directory.service';

describe('DirectoryService', () => {
    let service: DirectoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [DirectoryService, ElectronService] });
    });

    it('should be created', () => {
        service = TestBed.inject(DirectoryService);
        expect(service).toBeTruthy();
    });
});
