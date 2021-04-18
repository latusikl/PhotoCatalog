import * as path from 'path';
import * as piexif from 'piexif-ts';
import * as fs from 'fs';
import imageType from 'image-type';
import readChunk from 'read-chunk';
import IpcEvents from './ipc-events';
import ElectronConstants from './constants';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { IpcRegister } from './ipc-register';
import { ImageData } from '../../src/app/model/ImageData';
import { Settings } from '../../src/app/model/Settings';
import { deserialize } from 'class-transformer';
import { promises as fsPromises } from 'fs';
class IpcCommunication implements IpcRegister {
    private readonly CFG_PATH = path.join(__dirname, ElectronConstants.CONFIG_FILE);

    registerIpcHandlers(window: BrowserWindow): void {
        if (!window) {
            throw new Error('Window object was null. Unable to register events for window.');
        }
        this.addSelectDirHandler(window);
        this.getImagePathsFromDir(window);
        this.addSaveSettingsHandler();
        this.readConfigHandler(window);
    }

    readConfigHandler(window: BrowserWindow): void {
        ipcMain.on(IpcEvents.ToMain.READ_SETTINGS, async () => {
            if (!fs.existsSync(this.CFG_PATH)) {
                return;
            }
            try {
                const json = (await fsPromises.readFile(this.CFG_PATH)).toString();
                const settings = deserialize(Settings, json);
                this.correctSettings(settings);
                window.webContents.send(IpcEvents.ToRendered.SETTINGS_READY, settings);
            } catch (error) {
                console.error(error);
            }
        });
    }

    private addSaveSettingsHandler(): void {
        ipcMain.on(IpcEvents.ToMain.SAVE_SETTINGS, async (_ev, settings: Settings) => {
            this.correctSettings(settings);
            fsPromises.writeFile(this.CFG_PATH, JSON.stringify(settings), { flag: 'w' });
        });
    }

    private correctSettings(settings: Settings): void {
        // clear default path if invalid
        settings.darkMode = !!settings.darkMode;
        if (!!settings.defaultDir && !fs.existsSync(settings.defaultDir)) {
            settings.defaultDir = null;
        }
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
        const binary = fs.readFileSync(imgPath).toString('binary');
        const exif = piexif.load(binary);
        const name = imgPath.slice(imgPath.lastIndexOf(path.sep) + 1, imgPath.lastIndexOf('.'));
        return new ImageData(name, `file:///${imgPath}`, exif);
    }
}

export default new IpcCommunication();
