import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationViewComponent } from './view/location-view/location-view.component';

const routes: Routes = [{ path: 'location', component: LocationViewComponent }];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
