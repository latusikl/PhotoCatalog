import { BrowserWindow, ipcMain } from 'electron';
import IpcEvents from './ipc-events';
import fs, { promises as fsPromises } from 'fs';
import { deserialize } from 'class-transformer';
import { Settings } from '../../../src/app/model/Settings';
import path from 'path';
import ElectronConstants from '../constants';

export class SettingsHandlers {
    private readonly CFG_PATH = path.join(__dirname, ElectronConstants.CONFIG_FILE);
    private window: BrowserWindow;

    constructor(window: Electron.BrowserWindow) {
        this.window = window;
    }

    public readConfigHandler(): void {
        ipcMain.on(IpcEvents.ToMain.READ_SETTINGS, async () => {
            if (!fs.existsSync(this.CFG_PATH)) {
                return;
            }
            try {
                const json = (await fsPromises.readFile(this.CFG_PATH)).toString();
                const settings = deserialize(Settings, json);
                this.correctSettings(settings);
                this.window.webContents.send(IpcEvents.ToRendered.SETTINGS_READY, settings);
            } catch (error) {
                console.error(error);
            }
        });
    }

    public addSaveSettingsHandler(): void {
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
}
