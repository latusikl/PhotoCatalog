import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import IpcEvents from '../../../electron/src/communication/ipc-events';
import { Settings } from '../model/Settings';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    settings = new BehaviorSubject<Settings>(Settings.default());
    constructor(private electronService: ElectronService) {
        this.electronService.ipcRenderer?.on(IpcEvents.ToRendered.SETTINGS_READY, (_ev, data: Settings) => {
            this.settings.next(data);
            this.setDarkMode(data.darkMode);
        });
        this.electronService.ipcRenderer?.send(IpcEvents.ToMain.READ_SETTINGS);
    }

    save(newSettings: Settings): void {
        this.settings.value.darkMode = newSettings.darkMode; // persist darkmode settings in current app session
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
