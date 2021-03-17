import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    pageSize = 50;
    images = new BehaviorSubject<string[]>([]);

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer.on('images-found', (ev, dir) => {
            this.images.next(dir);
        });
    }

    getImagesFromLocation(dir: string): void {
        this.electronService.ipcRenderer.send('get-images', dir);
    }
}
