import { Injectable } from "@angular/core";
import { ElectronService } from "ngx-electron";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DirectoryService {
  constructor(private electronService: ElectronService) {}

  currentDirectory = new BehaviorSubject<string>('');

  callForDirectoryChoice() {
    console.log(this.electronService.isElectronApp);
    console.log(this.electronService.ipcRenderer);
    this.electronService.ipcRenderer.send("select-dir");

    this.electronService.ipcRenderer.on("dir-selected", (ev, dir) => {
      this.currentDirectory.next(dir);
    });
  }
}
