import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueDisplayComponent } from './issue-display/issue-display.component';

@NgModule({
    declarations: [IssueDisplayComponent],
    imports: [CommonModule],
    exports: [IssueDisplayComponent],
})
export class SinglePictureModule {}
