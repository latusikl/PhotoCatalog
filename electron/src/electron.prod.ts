import { app, BrowserWindow } from 'electron';
import ElectronConstants from './constants';
import { IpcCommunication } from './communication/ipc-communication';

let window: BrowserWindow | null;

function createWindow(): void {
    window = new BrowserWindow({
        width: ElectronConstants.WINDOW_WIDTH,
        height: ElectronConstants.WINDOW_HEIGHT,
        icon: ElectronConstants.ICON_SOURCE_PROD,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const appUrl = new URL(`file://${ElectronConstants.APP_PATH_PROD}`);
    window.loadURL(appUrl.toString());
    window.removeMenu();

    window.on('closed', () => {
        window = null;
    });
    loadIpcListeners(window);
}

function loadIpcListeners(window: Electron.BrowserWindow) {
    const ipcCommunication = new IpcCommunication(window);
    ipcCommunication.registerIpcHandlers();
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});
