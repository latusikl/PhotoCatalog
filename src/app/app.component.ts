import { Component } from "@angular/core";
import { DirectoryService } from "./service/directory.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(private directoryService: DirectoryService) {
    this.isExpanded = true;
  }

  isExpanded: boolean;

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  chooseFolder() {
    this.directoryService.callForDirectoryChoice();
  }
}
