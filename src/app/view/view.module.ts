import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationViewComponent } from './location-view/location-view.component';
import { MapModule } from '../component/map/map.module';
import { GalleryViewComponent } from './gallery-view/gallery-view.component';
import { SafeHtmlPipe } from '../utils/safe-html.pipe';

@NgModule({
    declarations: [LocationViewComponent, GalleryViewComponent, SafeHtmlPipe],
    imports: [CommonModule, MapModule],
})
export class ViewModule {}
