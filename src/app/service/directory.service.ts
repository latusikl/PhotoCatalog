import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import IpcEvents from '../../../electron/src/ipc-events';

@Injectable({
    providedIn: 'root',
})
export class DirectoryService {
    currentDirectory = new BehaviorSubject<string>('');

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.DIR_SELECTED, (ev, dir: string) => {
            this.currentDirectory.next(dir);
        });
    }

    callForDirectoryChoice(): void {
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.SELECT_DIR);
    }
}
