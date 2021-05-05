import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../model/Settings';
import IpcEvents from '../../../electron/src/communication/ipc-events';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    settings = new BehaviorSubject<Settings>(Settings.default());
    defaultDirSelection = new BehaviorSubject<string>('');

    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.SETTINGS_READY, (_ev, data: Settings) => {
            this.settings.next(data);
            if (!!data.defaultDir) {
                this.defaultDirSelection.next(data.defaultDir);
            }
            this.setDarkMode(data.darkMode);
        });
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.DEFAULT_DIR_SELECTED, (_ev, defaultDir: string) => {
            this.defaultDirSelection.next(defaultDir);
        });
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.READ_SETTINGS);
    }

    selectDefaultDir(): void {
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.SELECT_DEFAULT_DIR);
    }

    save(newSettings: Settings): void {
        this.settings.value.darkMode = newSettings.darkMode;
        this.settings.value.defaultDir = newSettings.defaultDir;
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.SAVE_SETTINGS, newSettings);
    }

    setDarkMode(darkMode: boolean): void {
        const list = document.body.classList;
        if (darkMode && list.contains('light-theme')) {
            list.remove('light-theme');
        } else if (!darkMode && !list.contains('light-theme')) {
            list.add('light-theme');
        }
    }
}
