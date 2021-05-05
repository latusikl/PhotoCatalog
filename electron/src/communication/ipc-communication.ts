import { BrowserWindow } from 'electron';
import { IpcRegister } from './ipc-register';
import { ImgDataHandlers } from './img-data-handlers';
import { SystemDialogHandlers } from './system-dialog-handlers';
import { SettingsHandlers } from './settings-handlers';

export class IpcCommunication implements IpcRegister {
    private imgDataHandlers: ImgDataHandlers;
    private systemDialogHandlers: SystemDialogHandlers;
    private settingsHandlers: SettingsHandlers;

    constructor(window: BrowserWindow) {
        if (!window) {
            throw new Error('Window object was null. Unable to register events for window.');
        }
        this.imgDataHandlers = new ImgDataHandlers(window);
        this.systemDialogHandlers = new SystemDialogHandlers(window);
        this.settingsHandlers = new SettingsHandlers(window);
    }

    registerIpcHandlers(): void {
        this.systemDialogHandlers.addSelectDirHandler();
        this.imgDataHandlers.getImagePathsFromDir();
        this.imgDataHandlers.modifyImageExifData();
        this.imgDataHandlers.getDataFromSingleFile();
        this.settingsHandlers.addSaveSettingsHandler();
        this.settingsHandlers.readConfigHandler();
        this.settingsHandlers.addSelectDefaultDirHandler();
    }
}
