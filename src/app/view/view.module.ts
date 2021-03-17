import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationViewComponent } from './location-view/location-view.component';
import { MapModule } from '../component/map/map.module';

@NgModule({
    declarations: [LocationViewComponent],
    imports: [CommonModule, MapModule],
})
export class ViewModule {}
