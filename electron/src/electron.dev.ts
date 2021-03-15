import { app, BrowserWindow } from 'electron';
import ElectronConstatns from './constants';
import ipcCommunication from './ipc-communication';

let window: BrowserWindow | null;

function createWindow(): void {
    window = new BrowserWindow({
        width: ElectronConstatns.WINDOW_WIDTH,
        height: ElectronConstatns.WINDOW_HEIGHT,
        icon: ElectronConstatns.ICON_SOURCE,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
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
    ipcCommunication.registerIpcHandlers(window);
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});
