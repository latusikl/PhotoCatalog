import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import { ImageData } from 'src/app/model/ImageData';
import IpcEvents from '../../../electron/src/ipc-events';

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    imagesNumber = new BehaviorSubject<number>(0);
    imagesData = new BehaviorSubject<ImageData[]>([]);

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer.on(IpcEvents.ToRendered.IMG_FOUND, (_ev, data: ImageData[]) => {
            this.imagesData.next(data);
        });

        this.electronService.ipcRenderer.on(IpcEvents.ToRendered.IMG_PAGE_FOUND, (_ev, data: ImageData[]) => {
            this.imagesData.next(data);
        });

        this.electronService.ipcRenderer.on(IpcEvents.ToRendered.IMG_NUM, (_ev, data: number) => {
            this.imagesNumber.next(data);
        });
    }

    getImagesNumber(dir: string): void {
        this.electronService.ipcRenderer.send(IpcEvents.ToMain.GET_IMG_NUM, dir);
    }

    getImagesPage(dir: string, currentPage: number, pageSize: number): void {
        this.electronService.ipcRenderer.send(IpcEvents.ToMain.GET_IMG_PAGE, dir, currentPage, pageSize);
    }

    getImages(dir: string): void {
        this.electronService.ipcRenderer.send(IpcEvents.ToMain.GET_IMG, dir);
    }
}
