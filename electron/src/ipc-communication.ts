import * as path from 'path';
import * as piexif from 'piexif-ts';
import * as fs from 'fs';
import imageType from 'image-type';
import readChunk from 'read-chunk';
import btoa from 'btoa';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { IpcRegister } from './ipc-register';
import { ImageData } from '../../src/app/model/ImageData';

class IpcCommunication implements IpcRegister {
    registerIpcHandlers(window: Electron.BrowserWindow): void {
        this.addSelectDirHandler(window);
        this.getImagePathsFromDir(window);
        this.getImagesNumber(window);
        this.getImagesPage(window);
    }

    private addSelectDirHandler(window: BrowserWindow | null): void {
        if (!window) {
            throw new Error('Window was null!');
        }

        ipcMain.on('select-dir', async () => {
            const result = await dialog.showOpenDialog(window, {
                properties: ['openDirectory'],
            });
            window.webContents.send('dir-selected', result.filePaths[0]);
        });
    }

    private getImagePathsFromDir(window: BrowserWindow | null): void {
        if (!window) {
            throw new Error('Window was null!');
        }

        ipcMain.on('get-images', (ev, dir: string) => {
            if (!dir) {
                window.webContents.send('images-found', []);
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
                window.webContents.send('images-found', imgsData);
            });
        });
    }

    private getImagesNumber(window: BrowserWindow | null): void {
        if (!window) {
            throw new Error('Window was null!');
        }

        ipcMain.on('get-images-number', (ev, dir: string) => {
            if (!dir) {
                window.webContents.send('images-number', 0);
                return;
            }
            fs.readdir(dir, (err, fileNames) => {
                if (!!err) {
                    console.error(err);
                }
                const num = fileNames
                    .map((name) => path.join(dir, name))
                    .filter((name) => this.filterFilesForImages(name)).length;
                window.webContents.send('images-number', num);
            });
        });
    }

    private getImagesPage(window: BrowserWindow | null): void {
        if (!window) {
            throw new Error('Window was null!');
        }

        ipcMain.on('get-images-page', (_ev, dir: string, currentPage: number, pageSize: number) => {
            if (!dir) {
                window.webContents.send('images-page-found', []);
                return;
            }
            fs.readdir(dir, (err, fileNames) => {
                if (!!err) {
                    console.error(err);
                }
                const start = currentPage * pageSize;
                const imgsData = fileNames
                    .map((name) => path.join(dir, name))
                    .filter((name) => this.filterFilesForImages(name))
                    .slice(start, start + pageSize)
                    .map((name) => this.mapToImageData(name));
                window.webContents.send('images-page-found', imgsData);
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

    private mapToImageData(name: string): ImageData {
        const binary = fs.readFileSync(name).toString('binary');
        const exif = piexif.load(binary);
        return <ImageData>{
            base64: btoa(binary),
            exifData: exif,
        };
    }
}

export default new IpcCommunication();
