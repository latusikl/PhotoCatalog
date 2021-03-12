import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  isExpanded: boolean = false;
  isShowing: boolean = false;

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  onMouseEnter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }
  onMouseExit() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  isSideNavFullWidth(): boolean {
    return this.isExpanded || this.isShowing;
  }
}
