import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationViewComponent } from './location-view/location-view.component';
import { MapModule } from '../component/map/map.module';
import { GalleryViewComponent } from './gallery-view/gallery-view.component';
import { SafeHtmlPipe } from '../utils/safe-html.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { SinglePictureModule } from '../component/single-picutre/single-picture.module';
import { SinglePictureViewComponent } from './single-picture-view/single-picture-view/single-picture-view.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [LocationViewComponent, GalleryViewComponent, SafeHtmlPipe, SinglePictureViewComponent],
    imports: [
        CommonModule,
        MapModule,
        MatPaginatorModule,
        RouterModule,
        SinglePictureModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class ViewModule {}
