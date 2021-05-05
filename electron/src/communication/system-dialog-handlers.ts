import { BrowserWindow, dialog, ipcMain } from 'electron';
import IpcEvents from './ipc-events';

export class SystemDialogHandlers {
    private window: BrowserWindow;

    constructor(window: Electron.BrowserWindow) {
        this.window = window;
    }

    addSelectDirHandler(): void {
        ipcMain.on(IpcEvents.ToMain.SELECT_DIR, async () => {
            const result = await dialog.showOpenDialog(this.window, {
                properties: ['openDirectory'],
            });
            this.window.webContents.send(IpcEvents.ToRendered.DIR_SELECTED, result.filePaths[0]);
        });
    }
}
