import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import IpcEvents from '../../../electron/src/communication/ipc-events';
import { ImageData } from '../model/ImageData';

@Injectable({
    providedIn: 'root',
})
export class DirectoryService {
    currentDirectory = new BehaviorSubject<string>('');
    chosenFile = new BehaviorSubject<ImageData | null>(null);

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.DIR_SELECTED, (ev, dir: string) => {
            this.currentDirectory.next(dir);
        });
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.IMG_SELECTED, (ev, file: ImageData | null) => {
            this.chosenFile.next(file);
        });
    }

    callForDirectoryChoice(): void {
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.SELECT_DIR);
    }

    callForSingleImageChoice(): void {
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.SELECT_IMG);
    }
}
