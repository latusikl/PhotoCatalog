import { Injectable } from "@angular/core";
import { ElectronService } from "ngx-electron";

@Injectable({
  providedIn: "root",
})
export class DirectoryService {
  constructor(private electronService: ElectronService) {}

  currentDirectory: string | undefined;

  //TODO Try other possibilities: https://stackoverflow.com/questions/36286592/how-to-integrate-electron-ipcrenderer-into-angular-2-app-based-on-typescript
  //Received in electron.dev.js
  callForDirectoryChoice() {
    console.log(this.electronService.isElectronApp);
    console.log(this.electronService.ipcRenderer);
    this.electronService.ipcRenderer.send("select-dir");

    // ipcMain.on("dir-selected", (event, arxgs) => {
    //   console.log(args);
    //   if (typeof args == "string") {
    //     console.log(args);
    //     this.currentDirectory = args;
    //   }
    // });
  }
}
