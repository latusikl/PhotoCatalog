import * as path from 'path';
import * as piexif from 'piexif-ts';
import * as fs from 'fs';
import imageType from 'image-type';
import readChunk from 'read-chunk';
import IpcEvents from './ipc-events';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { IpcRegister } from './ipc-register';
import { ImageData } from '../../src/app/model/ImageData';

class IpcCommunication implements IpcRegister {
    registerIpcHandlers(window: BrowserWindow): void {
        if (!window) {
            throw new Error('Window object was null. Unable to register events for window.');
        }
        this.addSelectDirHandler(window);
        this.getImagePathsFromDir(window);
        this.modifyImageExifData(window);
    }

    private addSelectDirHandler(window: BrowserWindow): void {
        ipcMain.on(IpcEvents.ToMain.SELECT_DIR, async () => {
            const result = await dialog.showOpenDialog(window, {
                properties: ['openDirectory'],
            });
            window.webContents.send(IpcEvents.ToRendered.DIR_SELECTED, result.filePaths[0]);
        });
    }

    private getImagePathsFromDir(window: BrowserWindow): void {
        ipcMain.on(IpcEvents.ToMain.GET_IMG, (ev, dir: string) => {
            if (!dir) {
                window.webContents.send(IpcEvents.ToRendered.IMG_FOUND, []);
                return;
            }
            fs.readdir(dir, (err, fileNames) => {
                if (!!err) {
                    console.error(err);
                }
                const imgsData = fileNames
                    .map((name) => path.join(dir, name))
                    .filter((name) => this.filterFilesForImages(name))
                    .map((name) => this.mapToImageData(name));
                window.webContents.send(IpcEvents.ToRendered.IMG_FOUND, imgsData);
            });
        });
    }

    private filterFilesForImages(name: string): boolean {
        if (fs.lstatSync(name).isDirectory()) {
            return false;
        }
        const imgChunk = readChunk.sync(name, 0, 12);
        const mime = imageType(imgChunk)?.mime;
        return !!mime ? mime.includes('image/jpeg') : false;
    }

    private mapToImageData(imgPath: string): ImageData {
        const binary = this.readImageDataBinary(imgPath);
        const exif = piexif.load(binary);
        const name = imgPath.slice(imgPath.lastIndexOf(path.sep) + 1, imgPath.lastIndexOf('.'));
        return new ImageData(name, `file:///${imgPath}`, exif);
    }

    private readImageDataBinary(imgPath: string): string {
        return fs.readFileSync(imgPath).toString('binary');
    }

    private modifyImageExifData(window: BrowserWindow): void {
        ipcMain.on(IpcEvents.ToMain.MODIFY_EXIF, (ev, imageData: ImageData) => {
            if (imageData && imageData.exifData && imageData.path) {
                const exifBinary = piexif.dump(imageData.exifData);
                const imageBinary = this.readImageDataBinary(imageData.path);
                piexif.insert(exifBinary, imageBinary);
                fs.writeFile(imageData.path, imageBinary, (err) => {
                    window.webContents.send(IpcEvents.ToRendered.MODIFY_EXIF_RESULT, [!!err, JSON.stringify(err)]);
                });
            } else {
                window.webContents.send(IpcEvents.ToRendered.MODIFY_EXIF_RESULT, [
                    true,
                    `Missing required data in received object: \n ${JSON.stringify(imageData)}`,
                ]);
            }
        });
    }
}

export default new IpcCommunication();
