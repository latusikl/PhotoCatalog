import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import { ImageData } from 'src/app/model/ImageData';

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    imagesNumber = new BehaviorSubject<number>(0);
    imagesData = new BehaviorSubject<ImageData[]>([]);

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer.on('images-found', (ev, data: ImageData[]) => {
            this.imagesData.next(data);
        });

        this.electronService.ipcRenderer.on('images-page-found', (ev, data: ImageData[]) => {
            this.imagesData.next(data);
        });

        this.electronService.ipcRenderer.on('images-number', (ev, data: number) => {
            this.imagesNumber.next(data);
        });
    }

    getImagesNumber(dir: string): void {
        this.electronService.ipcRenderer.send('get-images-number', dir);
    }

    getImagesPage(dir: string, currentPage: number, pageSize: number): void {
        this.electronService.ipcRenderer.send('get-images-page', dir, currentPage, pageSize);
    }

    getImages(dir: string): void {
        this.electronService.ipcRenderer.send('get-images', dir);
    }
}
