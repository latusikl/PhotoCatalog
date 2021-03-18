import { BrowserWindow, dialog, ipcMain } from 'electron';
import { IpcRegister } from './ipc-register';
import imageType from 'image-type';
import * as fs from 'fs';
import readChunk from 'read-chunk';
import * as path from 'path';

class IpcCommunication implements IpcRegister {
    registerIpcHandlers(window: Electron.BrowserWindow): void {
        this.addSelectDirHandler(window);
        this.getImagePathsFromDir(window);
    }

    private addSelectDirHandler(window: BrowserWindow | null): void {
        if (!window) {
            throw new Error('Window was null!');
        }

        ipcMain.on('select-dir', async () => {
            const result = await dialog.showOpenDialog(window, {
                properties: ['openDirectory'],
            });
            window.webContents.send('dir-selected', result.filePaths);
        });
    }

    private getImagePathsFromDir(window: BrowserWindow | null): void {
        if (!window) {
            throw new Error('Window was null!');
        }

        ipcMain.on('get-images', (ev, par: string[]) => {
            const dir = par[0];
            if (!dir) {
                window.webContents.send('images-found', []);
                return;
            }
            fs.readdir(dir, (err, files) => {
                if (!!err) {
                    console.error(err);
                }
                files = files
                    .map((name) => path.join(dir, name))
                    .filter((imgDir) => {
                        const imgChunk = readChunk.sync(imgDir, 0, 12);
                        return imageType(imgChunk)?.mime.startsWith('image') ?? false;
                    });
                window.webContents.send('images-found', files);
            });
        });
    }
}

export default new IpcCommunication();
