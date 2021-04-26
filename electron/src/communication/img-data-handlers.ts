import { BrowserWindow, dialog, ipcMain } from 'electron';
import IpcEvents from './ipc-events';
import fs from 'fs';
import path from 'path';
import readChunk from 'read-chunk';
import imageType from 'image-type';
import { ImageData } from '../../../src/app/model/ImageData';
import * as piexif from 'piexif-ts';
import { ExifModificationResult } from '../../../src/app/model/ExifModificationResult';

export class ImgDataHandlers {
    constructor(private window: BrowserWindow) {}

    public getImagePathsFromDir(): void {
        ipcMain.on(IpcEvents.ToMain.GET_IMG, (ev, dir: string) => {
            if (!dir) {
                this.window.webContents.send(IpcEvents.ToRendered.IMG_FOUND, []);
                return;
            }
            fs.readdir(dir, (err, fileNames) => {
                if (!!err) {
                    console.error(err);
                }
                const imgsData = fileNames
                    .map((name) => path.join(dir, name))
                    .filter((name) => this.isThisFileImage(name))
                    .map((name) => this.mapToImageData(name));
                this.window.webContents.send(IpcEvents.ToRendered.IMG_FOUND, imgsData);
            });
        });
    }

    private isThisFileImage(name: string): boolean {
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

    public modifyImageExifData(): void {
        ipcMain.on(IpcEvents.ToMain.MODIFY_EXIF, (ev, imageData: ImageData) => {
            if (imageData && imageData.exifData && imageData.path) {
                try {
                    const newExifBinary = piexif.dump(imageData.exifData);
                    const imageBinaryWithoutExif = piexif.remove(
                        this.readImageDataBinary(this.stripPathFromFileProtocol(imageData.path)),
                    );
                    const newBinaryImage = piexif.insert(newExifBinary, imageBinaryWithoutExif);
                    fs.writeFile(
                        this.stripPathFromFileProtocol(imageData.path),
                        newBinaryImage,
                        {
                            encoding: 'binary',
                        },
                        (err) => {
                            this.sendModificationResponse(JSON.stringify(err), !!err);
                        },
                    );
                } catch (e) {
                    this.sendModificationResponse(
                        `Error occurred during saving exif data to file.\n ${JSON.stringify(e)}`,
                        true,
                    );
                }
            } else {
                this.sendModificationResponse(
                    `Missing required data in received object: \n ${JSON.stringify(imageData)}`,
                    true,
                );
            }
        });
    }

    private stripPathFromFileProtocol(path: string): string {
        return path.substr(8);
    }

    private sendModificationResponse(responseMessage: string, isFailed: boolean): void {
        const response: ExifModificationResult = {
            modificationFailed: isFailed,
            errorMessage: responseMessage,
        };
        this.window.webContents.send(IpcEvents.ToRendered.MODIFY_EXIF_RESULT, response);
    }

    getDataFromSingleFile() {
        ipcMain.on(IpcEvents.ToMain.SELECT_IMG, async () => {
            const result = await dialog.showOpenDialog(this.window, {
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Only images',
                        extensions: ['jpg', 'jpeg'],
                    },
                ],
            });
            const path = result.filePaths[0];
            let imageData: ImageData | null = null;
            if (this.isThisFileImage(path)) {
                imageData = this.mapToImageData(path);
            }
            this.window.webContents.send(IpcEvents.ToRendered.IMG_SELECTED, imageData);
        });
    }
}
