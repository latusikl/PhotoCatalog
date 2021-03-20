import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryViewComponent } from './view/gallery-view/gallery-view.component';
import { LocationViewComponent } from './view/location-view/location-view.component';
import { SinglePictureViewComponent } from './view/single-picture-view/single-picture-view/single-picture-view.component';

const routes: Routes = [
    { path: 'location', component: LocationViewComponent },
    { path: 'gallery', component: GalleryViewComponent },
    { path: 'exif', component: SinglePictureViewComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
