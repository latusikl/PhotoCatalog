import { BrowserWindow, dialog, ipcMain } from 'electron';
import { Settings } from '../../../src/app/model/Settings';
import IpcEvents from './ipc-events';
import Store from 'electron-store';
export class SettingsHandlers {
    private window: BrowserWindow;
    private readonly store = new Store<Settings>({
        defaults: Settings.default(),
    });

    constructor(window: Electron.BrowserWindow) {
        this.window = window;
    }

    addSelectDefaultDirHandler(): void {
        ipcMain.on(IpcEvents.ToMain.SELECT_DEFAULT_DIR, async () => {
            const result = await dialog.showOpenDialog(this.window, {
                properties: ['openDirectory'],
            });
            const dir = result.filePaths[0];
            if (!!dir) {
                this.window.webContents.send(IpcEvents.ToRendered.DEFAULT_DIR_SELECTED, dir);
            }
        });
    }

    readConfigHandler(): void {
        ipcMain.on(IpcEvents.ToMain.READ_SETTINGS, async () => {
            if (!this.store.size) {
                return;
            }
            try {
                const settings = this.store.store;
                settings.darkMode = !!settings.darkMode;
                this.window.webContents.send(IpcEvents.ToRendered.SETTINGS_READY, settings);
            } catch (error) {
                console.error(error);
            }
        });
    }

    addSaveSettingsHandler(): void {
        ipcMain.on(IpcEvents.ToMain.SAVE_SETTINGS, async (_ev, settings: Settings) => {
            settings.darkMode = !!settings.darkMode;
            this.store.clear();
            this.store.set('darkMode', settings.darkMode);
            if (!!settings.defaultDir) {
                this.store.set('defaultDir', settings.defaultDir);
            }
        });
    }
}
