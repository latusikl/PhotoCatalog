import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DirectoryService {
    currentDirectory = new BehaviorSubject<string>('');

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer.on('dir-selected', (ev, dir) => {
            this.currentDirectory.next(dir);
        });
    }

    callForDirectoryChoice(): void {
        this.electronService.ipcRenderer.send('select-dir');
    }
}
