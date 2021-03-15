import { BrowserWindow, dialog, ipcMain } from 'electron';
import { IpcRegister } from './ipc-register';

class IpcCommunication implements IpcRegister {
    registerIpcHandlers(window: Electron.BrowserWindow): void {
        addSelectDirHandler(window);
    }
}

function addSelectDirHandler(window: BrowserWindow | null): void {
    if (window == null) {
        console.error('Window was null!');
    } else {
        ipcMain.on('select-dir', async () => {
            const result = await dialog.showOpenDialog(window, {
                properties: ['openDirectory'],
            });
            window.webContents.send('dir-selected', result.filePaths);
        });
    }
}

export default new IpcCommunication();
