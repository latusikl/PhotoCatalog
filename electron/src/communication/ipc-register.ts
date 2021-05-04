import { BrowserWindow } from 'electron';

export interface IpcRegister {
    registerIpcHandlers(window: BrowserWindow): void;
}
