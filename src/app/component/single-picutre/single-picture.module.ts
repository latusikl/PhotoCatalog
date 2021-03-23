import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueDisplayComponent } from './issue-display/issue-display.component';
import { ExifDisplayComponent } from './exif-display/exif-display.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    declarations: [IssueDisplayComponent, ExifDisplayComponent],
    imports: [CommonModule, MatTableModule, MatPaginatorModule],
    exports: [IssueDisplayComponent, ExifDisplayComponent],
})
export class SinglePictureModule {}
