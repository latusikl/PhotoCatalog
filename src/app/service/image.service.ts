import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import { ImageData } from 'src/app/model/ImageData';
import { plainToClass } from 'class-transformer';
import IpcEvents from '../../../electron/src/ipc-events';

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    imagesNumber = new BehaviorSubject<number>(0);
    imagesData = new BehaviorSubject<ImageData[]>([]);

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.IMG_FOUND, (_ev, data: ImageData[]) => {
            this.imagesData.next(plainToClass(ImageData, data));
        });
    }

    getImages(dir: string): void {
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.GET_IMG, dir);
    }
}
