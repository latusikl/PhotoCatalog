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
    modificationResponse = new BehaviorSubject<[boolean, string]>([false, '']);

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.IMG_FOUND, (_ev, data: ImageData[]) => {
            this.imagesData.next(plainToClass(ImageData, data));
        });
        this.electronService.ipcRenderer.on(IpcEvents.ToRendered.MODIFY_EXIF_RESULT, (ev, data: [boolean, string]) => {
            this.modificationResponse.next(data);
        });
    }

    getImages(dir: string): void {
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.GET_IMG, dir);
    }

    saveNewExifValue(imageData: ImageData): void {
        console.dir(imageData);
        this.electronService.ipcRenderer.send(IpcEvents.ToMain.MODIFY_EXIF, imageData);
    }
}
