import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationViewComponent } from './location-view/location-view.component';
import { MapModule } from '../component/map/map.module';
import { GalleryViewComponent } from './gallery-view/gallery-view.component';
import { SafeHtmlPipe } from '../utils/safe-html.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SinglePictureViewComponent } from './single-picture-view/single-picture-view/single-picture-view.component';

@NgModule({
    declarations: [LocationViewComponent, GalleryViewComponent, SafeHtmlPipe, SinglePictureViewComponent],
    imports: [CommonModule, MapModule, MatPaginatorModule],
})
export class ViewModule {}
