import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationViewComponent } from './location-view/location-view.component';
import { MapModule } from '../component/map/map.module';
import { GalleryViewComponent } from './gallery-view/gallery-view.component';
import { SafeHtmlPipe } from '../utils/safe-html.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { SinglePictureViewComponent } from './single-picture-view/single-picture-view/single-picture-view.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { IssueDisplayComponent } from '../component/single-picutre/issue-display/issue-display.component';
import { ExifDisplayComponent } from '../component/single-picutre/exif-display/exif-display.component';

@NgModule({
    declarations: [
        LocationViewComponent,
        GalleryViewComponent,
        SafeHtmlPipe,
        SinglePictureViewComponent,
        IssueDisplayComponent,
        ExifDisplayComponent,
    ],
    imports: [
        CommonModule,
        MapModule,
        MatPaginatorModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
    ],
})
export class ViewModule {}
