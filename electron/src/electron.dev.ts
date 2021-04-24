import { app, BrowserWindow, protocol } from 'electron';
import ElectronConstants from './constants';
import { IpcCommunication } from './communication/ipc-communication';

let window: BrowserWindow | null;

function createWindow(): void {
    window = new BrowserWindow({
        width: ElectronConstants.WINDOW_WIDTH,
        height: ElectronConstants.WINDOW_HEIGHT,
        minWidth: ElectronConstants.MIN_WINDOW_WIDTH,
        minHeight: ElectronConstants.MIN_WINDOW_HEIGHT,
        icon: ElectronConstants.ICON_SOURCE_DEV,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        },
    });

    window.loadURL('http://localhost:4200');

    window.webContents.openDevTools();

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
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURIComponent(request.url.replace('file:///', ''));
        callback(pathname);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});
